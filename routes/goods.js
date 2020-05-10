const { Router } = require('express');
const router = Router();
const Good = require('../models/Good');

router.get('/', async (req, res) => {
  const goods = await Good.getAll();
  res.render('goods', {
    title: 'Товары',
    isGoods: true,
    goods: goods
  })
})

router.get('/:id', async (req, res) => {
  const good = await Good.getById(req.params.id);
  res.render('good', {
    title: `${good.title}`,
    good
  });
})

router.get('/:id/edit', async (req, res) => {
  if (!req.query.allow) {
    res.redirect('/')
    return;
  }

  const good = await Good.getById(req.params.id);

  res.render('edit', {
    title: `Редактирование товара ${good.name}`,
    good
  })
})

router.post('/edit', async (req, res) => {
  await Good.update(req.body);
  res.redirect('/goods')
})

router.post('/remove', async (req, res) => {
  const { id } = req.body;
  await Good.remove(id);

  res.redirect('/goods');
})

module.exports = router;