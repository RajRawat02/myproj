const express = require('express');
const router = express.Router();

const product_controller = require('../controllers/product.controller');

router.get('/products/test',product_controller.test);

router.post('/products/create',product_controller.product_create);

router.get('/products/:id',product_controller.product_details);

router.put('/products/:id/update',product_controller.product_update);

router.delete('/products/:id/delete',product_controller.product_delete);

router.post('/login',product_controller.login);

router.post('/register',product_controller.register);

module.exports = router;