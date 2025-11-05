const Joi = require('joi');
const { Category, Service } = require('../config/database');

const categorySchema = Joi.object({
  name: Joi.string().min(1).max(150).required()
});

exports.createCategory = async (req, res, next) => {
  try {
    const { error, value } = categorySchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const existing = await Category.findOne({ where: { name: value.name } });
    if (existing) return res.status(409).json({ message: 'Category already exists' });

    const category = await Category.create({ name: value.name });
    return res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      order: [['createdAt', 'DESC']]
    });
    return res.json(categories);
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { error, value } = categorySchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const category = await Category.findByPk(categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    // avoid duplicate names
    const check = await Category.findOne({ where: { name: value.name, id: { $ne: categoryId } } }).catch(()=>null);
    if (check && check.id !== Number(categoryId)) {
      return res.status(409).json({ message: 'Category name already in use' });
    }

    category.name = value.name;
    await category.save();
    return res.json(category);
  } catch (err) {
    next(err);
  }
};

exports.deleteCategoryIfEmpty = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findByPk(categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const servicesCount = await Service.count({ where: { categoryId } });
    if (servicesCount > 0) {
      return res.status(400).json({ message: 'Category is not empty. Remove all services first.' });
    }

    await category.destroy();
    return res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};
