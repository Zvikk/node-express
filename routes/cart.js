const { Router } = require('express');
const Good = require('../models/Good');
const Cart = require('../models/Cart');
const guard = require('../middleware/routerGuard');
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

router.get('/', guard, async (req, res) => {
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

router.post('/add', guard, async (req, res) => {
  const good = await Good.findById(req.body.id);
  await req.user.addToCart(good);
  res.redirect('/goods');
});

router.delete('/remove/:id', guard, async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  res.status(200);
  res.render('cart');
});

module.exports = router;
