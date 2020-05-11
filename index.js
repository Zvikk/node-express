const express = require('express');
const expressHandlebars = require('express-handlebars');
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
const homeRouter = require('./routes/home');
const goodsRouter = require('./routes/goods');
const addRouter = require('./routes/add');
const cartRouter = require('./routes/cart');

const hbs = expressHandlebars.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use('/', homeRouter);
app.use('/goods', goodsRouter);
app.use('/new-good', addRouter);
app.use('/cart', cartRouter);

async function start() {
  try {
    const url = 'mongodb+srv://zvikk:TBqghEVFuaEvLUSA@cluster0-jtoot.mongodb.net/node-shop';
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true });

    app.listen(PORT, () => {
      console.log('server was running');
    });
  } catch (error) {
    console.log('error', error);
  }
}

start();
