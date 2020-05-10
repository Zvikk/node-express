const fs = require('fs');
const path = require('path');

const cartPath = path.join(
  __dirname,
  '../data',
  'cart.json'
)

class Cart {
  static async add(good) {
    let cart = await Cart.getAll();
    const index = cart.items.findIndex(item => item.id === good.id);
    
    if (index >= 0) {
      cart.items[index].amount = +cart.items[index].amount + +good.amount;
    } else {
      cart.items.push(good);
    }

    cart.price = cart.items.reduce((acc, current) => acc + (current.amount * current.price), 0);

    await Cart.write(cart);
  }

  static async removeById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const cart = await Cart.getAll();
        cart.items = cart.items.filter(item => item.id !== id);
        cart.price = cart.items.reduce((acc, current) => acc + (current.amount * current.price), 0);
        await Cart.write(cart);
        resolve();
      } catch (error) {
        reject(error);
      }
    })
  }

  static write(cart) {
    return new Promise((res, rej) => {
      fs.writeFile(
        cartPath,
        JSON.stringify(cart),
        (err) => {
          if (err) rej(err);
          res();
        }
      );
    });
  }

  static getAll() {
    return new Promise((res, rej) => {
      fs.readFile(
        path.join(__dirname, '../data/cart.json'),
        'utf-8',
        (err, content) => {
          if (err) rej(err);

          return res(JSON.parse(content));
        }
      );
    });
  }
}

module.exports = Cart;
