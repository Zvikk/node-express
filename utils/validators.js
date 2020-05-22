const { body } = require('express-validator');

exports.registerValidators = [
  body('remail').isEmail().withMessage('Некорректный e-mail'),
  body('rpassword', 'Пароль должен быть не менее 8 знаков').isLength({ min: 8 }).isAlphanumeric(),
  body('name', 'Имя должно содержать не менее 3-х символов').isLength({ min: 3 })
]