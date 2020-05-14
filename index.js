const express = require('express');
const expressHandlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const userMiddleware = require('./middleware/user');
const app = express();
const PORT = process.env.PORT || 3000;
const homeRouter = require('./routes/home');
const goodsRouter = require('./routes/goods');
const addRouter = require('./routes/add');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');

const MONGODB_URI = 'mongodb+srv://zvikk:81m5st5w7f2f1CIQ@cluster0-r2hgp.mongodb.net/node-shop';

const authMiddleware = require('./middleware/authChecker');

const hbs = expressHandlebars.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

const store = new MongoStore({
  collection: 'sessions',
  uri: MONGODB_URI
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'some secret string',
    resave: false,
    saveUninitialized: false,
    store
  })
);

app.use(authMiddleware);
app.use(userMiddleware);
app.use('/', homeRouter);
app.use('/goods', goodsRouter);
app.use('/new-good', addRouter);
app.use('/cart', cartRouter);
app.use('/orders', ordersRouter);
app.use('/auth', authRouter);

async function start() {
  try {
    const url =
      'mongodb+srv://zvikk:81m5st5w7f2f1CIQ@cluster0-r2hgp.mongodb.net/node-shop';

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    });

    app.listen(PORT, () => {
      console.log('server was running');
    });
  } catch (error) {
    console.log('error', error);
  }
}

start();
