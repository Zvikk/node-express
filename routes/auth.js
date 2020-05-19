const { Router } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const keys = require('../keys');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const regTemplate = require('../emails/reg');

const router = Router();

const transporter = nodemailer.createTransport(sendgrid({
  auth: {
    api_key: keys.SENDGRID_API_KEY  
  }
}))

const msg = {
  to: 'test@example.com',
  from: 'test@example.com',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

router.get('/', async (req, res) => {

  res.render('auth/login', {
    title: 'Авторизация',
    loginError: req.flash('login-error'),
    registerError: req.flash('register-error'),
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth');
  });
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const areSame = await bcrypt.compare(user.password, req.body.password);

      if (areSame) {
        req.session.user = user;
        req.session.isAuthentificated = true;
        req.session.save((err) => {
          if (err) throw err;
          res.redirect('/');
        });
      } else {
        req.flash('login-error', 'Неверный пароль');
        res.redirect('/auth#login');  
      }
    } else {
      req.flash('login-error', 'Пользователь не найден');
      res.redirect('/auth#login');
    }
  } catch (error) {}
});

router.post('/register', async (req, res) => {
  try {
    const { remail: email, rpassword: password, name } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      req.flash(
        'register-error',
        'Пользователь с таким email-oм уже существует'
      );
      res.redirect('/auth#register');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      name,
      password: hashPassword,
      cart: { items: [] },
    });
    await user.save();
    await transporter.sendMail(regTemplate(email));
    res.redirect('/');
  } catch (error) {
    console.log('error', error);
  }
});

router.post('/reset-password', (req, res) => {
  const user = User.findById(req.body.id);
})

module.exports = router;
