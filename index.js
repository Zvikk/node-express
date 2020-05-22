const express = require('express');
const expressHandlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const userMiddleware = require('./middleware/user');
const app = express();
const PORT = process.env.PORT || 3000;
const homeRouter = require('./routes/home');
const goodsRouter = require('./routes/goods');
const addRouter = require('./routes/add');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');
const keys = require('./keys');

const authMiddleware = require('./middleware/authChecker');

const hbs = expressHandlebars.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URI,
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(csrf());
app.use(flash());
app.use(authMiddleware);
app.use(userMiddleware);
app.use('/', homeRouter);
app.use('/goods', goodsRouter);
app.use('/new-good', addRouter);
app.use('/cart', cartRouter);
app.use('/orders', ordersRouter);
app.use('/auth', authRouter);

app.use(function (req, res, next) {
  res.status(404).render('errors/404');
});

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
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
