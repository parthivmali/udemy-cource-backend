const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users-controllers');
const { check } = require('express-validator')

router.get('/', usersController.getUsers);

router.post('/signup', [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min:6})
], usersController.signup);

router.post('/login', usersController.login);

module.exports = router;