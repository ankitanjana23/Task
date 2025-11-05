const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const categoryController = require('../controllers/categoryController');
const serviceController = require('../controllers/serviceController');

// CATEGORY
router.post('/category', authMiddleware.verifyToken, categoryController.createCategory);
router.get('/categories', authMiddleware.verifyToken, categoryController.getAllCategories);
router.put('/category/:categoryId', authMiddleware.verifyToken, categoryController.updateCategory);
router.delete('/category/:categoryId', authMiddleware.verifyToken, categoryController.deleteCategoryIfEmpty);

// SERVICES (within category)
router.post('/category/:categoryId/service', authMiddleware.verifyToken, serviceController.createService);
router.get('/category/:categoryId/services', authMiddleware.verifyToken, serviceController.getServicesByCategory);
router.put('/category/:categoryId/service/:serviceId', authMiddleware.verifyToken, serviceController.updateService);
router.delete('/category/:categoryId/service/:serviceId', authMiddleware.verifyToken, serviceController.deleteService);

module.exports = router;
