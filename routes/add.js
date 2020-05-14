const { Router } = require('express');
const Good = require('../models/Good');
const guard = require('../middleware/routerGuard');
const router = Router();

router.get('/', guard, (req, res) => {
  res.render('add', {
    title: 'Новый товар',
    isAdd: true,
  });
});

router.post('/', guard, async (req, res) => {
  const { name, amount, price, image } = req.body;
  const good = new Good({ name, amount, price, image, userId: req.user }); 
  try {
    await good.save();
    res.redirect('/goods');
  } catch (error) {
    console.log('error', error);
  }
});

module.exports = router;
