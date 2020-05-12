const { Router } = require('express');
const Cart = require('../models/Cart');
const Good = require('../models/Good');
const router = Router();

function mapCartItems(cart) {
  return cart.items.map((good) => ({
    count: good.count,
    ...good.goodId._doc,
  }));
}

function computePrice(goods) {
  return goods.reduce((acc, current) => acc + current.count * current.price, 0);
}

router.get('/', async (req, res) => {
  const user = await req.user
    .populate('cart.items.goodId', 'name price image')
    .execPopulate();

  const items = mapCartItems(user.cart);

  res.render('cart', {
    title: 'Корзина',
    isCart: true,
    items,
    total: computePrice(items),
  });
});

router.post('/add', async (req, res) => {
  const good = await Good.findById(req.body.id);
  await req.user.addToCart(good);
  res.redirect('/goods');
});

router.delete('/remove/:id', async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  res.status(200);
  res.end();
});

module.exports = router;
