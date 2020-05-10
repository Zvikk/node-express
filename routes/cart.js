const { Router } = require('express');
const Cart = require('../models/Cart');
const Good = require('../models/Good');
const router = Router();

router.get('/', async (req, res) => {
  const cart = await Cart.getAll();
  res.render('cart', {
    title: "Коризна",
    isCart: true,
    items: cart.items,
    total: cart.price
  })
})

router.post('/add', async (req, res) => {
  const good = await Good.getById(req.body.id);
  await Cart.add(good);
  res.redirect('/goods');
})

router.delete('/remove/:id', async (req, res) => {
  await Cart.removeById(req.params.id);
  res.status(200);
  res.end();
})

module.exports = router;