const { Router } = require('express');
const router = Router();
const Good = require('../models/Good');

router.get('/', (req, res) => {
  res.render('add', {
    title: 'Новый товар',
    isAdd: true,
  });
});

router.post('/', async (req, res) => {
  const { name, amount, price, image } = req.body;
  const good = new Good(name, amount, price, image);
  await good.save();
  res.redirect('/goods');
});

module.exports = router;
