const express = require('express');
const router = express.Router();

const { UserController } = require('../controllers');

router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.post('/', UserController.create);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);
router.post('/sign-in', UserController.signIn);
// router.post('/sign-up', UserController.signUp);

module.exports = router;