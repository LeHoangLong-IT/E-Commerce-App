const express = require('express');
const router = express.Router();

const { ProductController } = require('../controllers');

router.get('/', ProductController.getAll);
router.get('/slug/:slug', ProductController.getBySlug);
router.post('/', ProductController.create);
router.put('/:id', ProductController.update);
router.delete('/:id', ProductController.delete);

module.exports = router;