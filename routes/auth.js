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
  const user = await User.findById('5eb9c88dad17481d51c65d77');
  req.session.user = user;
  req.session.isAuthentificated = true;
  req.session.save((err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

module.exports = router;
