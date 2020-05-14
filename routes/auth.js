const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
  });
});

router.post('/', async (req, res) => {
});

module.exports = router;
