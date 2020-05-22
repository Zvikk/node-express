const { Router } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const keys = require('../keys');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const regTemplate = require('../emails/reg');
const resetTemplate = require('../emails/reset');

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
      const areSame = await bcrypt.compare(req.body.password, user.password);

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
    req.session.user = user;
    req.session.isAuthentificated = true;
    req.session.save((err) => {
      if (err) throw err;
      res.redirect('/');
    });
  } catch (error) {
    console.log('error', error);
  }
});

router.get('/reset', (req, res) => {
  res.render('auth/reset', {
    resetError: req.flash('reset-error')
  });
})

router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash(
          'reset-error',
          'Что-то пошло не так...'
        );
        res.redirect('/auth/reset');
      }

      const token = buffer.toString('hex');
      const user = await User.findOne({email: req.body.email});

      if (user) {
        user.resetToken = token;
        user.resetTokenExp = Date.now() + 3600;
        await user.save();
        await transporter.sendMail(resetTemplate(user.email, token));
        res.redirect('/auth');
      } else {
        req.flash(
          'reset-error',
          'Пользователь с указанным e-mail не найден'
        );
        res.redirect('/auth/reset');
      }
    })
  } catch (error) {
    console.log('error', error);
  }
})

router.get('/password/:token', async (req, res) => {
  try {
    if (!req.params.token) {
      return res.redirect('/auth')
    }

    const user = await User.findOne({resetToken: req.params.token})
    const isExp = Date.now() - user.resetTokenExp;

    if (user && isExp) {
      res.render('auth/password', {
        title: 'Создание нового пароля',
        userId: user._id,
        token: req.params.token
      });
    } else {
      res.redirect('/auth');
    }
  } catch (error) {
    res.redirect('/auth');
  }
})

router.post('/password', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId, resetToken: req.body.token });
    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetToken = undefined;
    user.resetTokenExp = undefined;
    await user.save();
    console.log('user', user)
    res.redirect('/auth')
  } catch (error) {
    req.flash('login-error', 'Токен просрочен');
  }
})

module.exports = router;
