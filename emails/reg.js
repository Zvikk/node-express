const keys = require('../keys');

module.exports = function(to) {
  return {
    to: to,
    from: keys.FROM_EMAIL,
    subject: 'Register user',
    html: `
      <h1>Аккаунт успешно зарегистрирован</h1>
    `
  }
}