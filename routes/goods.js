const { Router } = require('express');
const Good = require('../models/Good');
const guard = require('../middleware/routerGuard');
const router = Router();

router.get('/', async (req, res) => {
  const goods = await Good.find().populate('userId', 'email name');

  res.render('goods', {
    title: 'Товары',
    isGoods: true,
    userId: req.user ? req.user._id.toString() : null,
    goods,
  });
});

router.get('/:id', async (req, res) => {
  try {
    const good = await Good.findById(req.params.id);
    res.render('good', {
      title: `${good.name}`,
      good,
    });
  } catch (error) {
    res.redirect('/goods')
  }
});

router.get('/:id/edit', guard, async (req, res) => {
  try {
    const good = await Good.findById(req.params.id);
    if (good.userId.toString() != req.user._id.toString()) {
      return res.redirect('/goods')
    }
  
    res.render('edit', {
      title: `Редактирование товара ${good.name}`,
      good,
    });  
  } catch (error) {
    console.log('error', error);
  }
});

router.post('/edit', guard, async (req, res) => {
  const { id } = req.body;
  delete req.body.id;
  const good = await Good.findById(id)
  if (req.user._id.toString() != good.userId.toString()) {
    return res.redirect('/goods');
  }
  await good.updateOne(id, req.body);
  res.redirect('/goods');
});

router.post('/remove', guard, async (req, res) => {
  try {
    const good = await Good.findById(req.body.id);

    if (req.user._id.toString() != good.userId.toString()) {
      return res.redirect('/goods');
    }
    await Good.deleteOne({_id: req.body.id});

    res.redirect('/goods');  
  } catch (error) {
    console.log('error', error);
  }
});

module.exports = router;
