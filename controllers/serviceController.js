const Joi = require('joi');
const { sequelize, Service, Category, PriceOption } = require('../config/database');
const { Op } = require('sequelize');

const priceOptionSchema = Joi.object({
  id: Joi.number().optional(), // when updating existing option
  duration: Joi.string().required(),
  price: Joi.number().positive().required(),
  type: Joi.string().valid('Hourly', 'Weekly', 'Monthly').required()
});

const serviceSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  type: Joi.string().valid('Normal', 'VIP').required(),
  priceOptions: Joi.array().items(priceOptionSchema).optional()
});

exports.createService = async (req, res, next) => {
  const t = await sequelize.transaction(); // ✅ correct instance
  try {
    const { categoryId } = req.params;
    const { name, type, priceOptions } = req.body;

    // Check if category exists
    const category = await Category.findByPk(categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    // Create new service
    const service = await Service.create(
      { name, type, categoryId },
      { transaction: t }
    );

    // Add multiple price options
    if (priceOptions && Array.isArray(priceOptions)) {
      for (const option of priceOptions) {
        await PriceOption.create(
          {
            serviceId: service.id,
            duration: option.duration,
            price: option.price,
            type: option.type,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();

    // Return service with price options
    const createdService = await Service.findOne({
      where: { id: service.id },
      include: [PriceOption]
    });

    return res.status(201).json(createdService);
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.getServicesByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findByPk(categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const services = await Service.findAll({
      where: { categoryId },
      include: [{ model: PriceOption }],
      order: [['createdAt', 'DESC']]
    });

    return res.json(services);
  } catch (err) {
    next(err);
  }
};

exports.updateService = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { categoryId, serviceId } = req.params;
    const { error, value } = serviceSchema.validate(req.body);
    if (error) {
      await t.rollback();
      return res.status(400).json({ message: error.details[0].message });
    }

    const service = await Service.findOne({ where: { id: serviceId, categoryId } });
    if (!service) {
      await t.rollback();
      return res.status(404).json({ message: 'Service not found for this category' });
    }

    // Update name and type
    await service.update({ name: value.name, type: value.type }, { transaction: t });

    // Update price options
    if (value.priceOptions) {
      const incomingIds = value.priceOptions.filter(po => po.id).map(po => po.id);

      // Delete old options not included anymore
      await PriceOption.destroy({
        where: {
          serviceId: service.id,
          id: { [Op.notIn]: incomingIds.length ? incomingIds : [0] },
        },
        transaction: t,
      });

      // Update existing or create new
      for (const po of value.priceOptions) {
        if (po.id) {
          await PriceOption.update(
            { duration: po.duration, price: po.price, type: po.type },
            { where: { id: po.id, serviceId: service.id }, transaction: t }
          );
        } else {
          await PriceOption.create(
            { serviceId: service.id, duration: po.duration, price: po.price, type: po.type },
            { transaction: t }
          );
        }
      }
    }

    await t.commit();

    const updated = await Service.findByPk(service.id, { include: [PriceOption] });
    return res.json(updated);
  } catch (err) {
    await t.rollback();
    next(err);
  }
};


exports.deleteService = async (req, res, next) => {
  try {
    const { categoryId, serviceId } = req.params;

    const service = await Service.findOne({ where: { id: serviceId, categoryId } });
    if (!service) return res.status(404).json({ message: 'Service not found' });

    await PriceOption.destroy({ where: { serviceId } }); // delete linked prices
    await service.destroy();

    return res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    next(err);
  }
};

