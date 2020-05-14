const { Router } = require('express');
const Order = require('../models/Order');
const guard = require('../middleware/routerGuard');
const router = Router();

router.get('/', guard, async (req, res) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id });

    res.render('orders', {
      title: 'Мои заказы',
      orders: orders.map((o) => ({
        ...o._doc,
        total: o.goods.reduce((acc, g) => acc + g.good.price * g.count, 0),
      })),
      isOrders: true,
    });
  } catch (error) {
    console.log('error', error);
  }
});

router.post('/', guard, async (req, res) => {
  try {
    const user = await req.user.populate('cart.items.goodId').execPopulate();
    const goods = user.cart.items.map((i) => ({
      count: i.count,
      good: { ...i.goodId._doc },
    }));

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      goods,
    });

    await order.save();
    await req.user.clearCart();

    res.redirect('orders');
  } catch (error) {
    console.log('error', error);
  }
});

module.exports = router;
