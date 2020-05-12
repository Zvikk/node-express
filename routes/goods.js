const { Router } = require('express');
const router = Router();
const Good = require('../models/Good');

router.get('/', async (req, res) => {
  const goods = await Good.find().populate('userId', 'email name');

  console.log('goods', goods);
  res.render('goods', {
    title: 'Товары',
    isGoods: true,
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
  } catch (error) {}
});

router.get('/:id/edit', async (req, res) => {
  if (!req.query.allow) {
    res.redirect('/');
    return;
  }

  const good = await Good.findById(req.params.id);

  res.render('edit', {
    title: `Редактирование товара ${good.name}`,
    good,
  });
});

router.post('/edit', async (req, res) => {
  const { id } = req.body;
  delete req.body.id;

  await Good.findByIdAndUpdate(id, req.body);
  res.redirect('/goods');
});

router.post('/remove', async (req, res) => {
  await Good.deleteOne({_id: req.body.id});

  res.redirect('/goods');
});

module.exports = router;
