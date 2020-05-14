const { Router } = require('express');
const User = require('../models/User');
const router = Router();

router.get('/', (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
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
      res.redirect('/auth');
    } else if (user.password === req.body.password) {
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
      res.redirect('/auth');
    }

    const user = new User({ email, name, password, cart: { items: [] } });
    await user.save();
    res.redirect('/');
  } catch (error) {
    console.log('error', error);
  }
});

module.exports = router;
