const { Router } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = Router();

router.get('/', (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
    loginError: req.flash('login-error'),
    registerError: req.flash('register-error')
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
    if (!user) {
      req.flash('login-error', 'Пользователь не найден')
      res.redirect('/auth#login');
    } else if (bcrypt.compare(user.password, req.body.password)) {
      req.session.user = user;
      req.session.isAuthentificated = true;
      req.session.save((err) => {
        if (err) throw err;
        res.redirect('/');
      });
    }
  } catch (error) {}
});

router.post('/register', async (req, res) => {
  try {
    const { remail: email, rpassword: password, name } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      req.flash('register-error', 'Пользователь с таким email-oм уже существует')
      res.redirect('/auth#register');
    }
    
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, name, password: hashPassword, cart: { items: [] } });
    await user.save();
    res.redirect('/');
  } catch (error) {
    console.log('error', error);
  }
});

module.exports = router;
