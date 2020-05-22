const keys = require('../keys');

module.exports = function(to, token) {
  return {
    to: to,
    from: keys.FROM_EMAIL,
    subject: 'Восстановление пароля',
    html: `
      <h1>Вы забыли пароль?</h1>
      <span>Если нет, то проигнорируйте данное письмо</span>
      <p>Иначе нажмите на ссылку<p>
      <a href="${keys.BASE_URL}/auth/password/${token}">Восстановить</a>
    `
  }
}