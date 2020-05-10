const uuid = require('uuid');
const fs = require('fs');
const path = require('path');

class Good {
  constructor(name, amount, price, image) {
    this.name = name;
    this.amount = amount;
    this.price = price;
    this.image = image;
    this.id = uuid.v4();
  }
  toJSON() {
    return { ...this };
  }

  async save() {
    const goods = await Good.getAll();

    goods.push(this.toJSON());

    return new Promise((res, rej) => {
      fs.writeFile(
        path.join(__dirname, '../data/goods.json'),
        JSON.stringify(goods),
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
        path.join(__dirname, '../data/goods.json'),
        'utf-8',
        (err, content) => {
          if (err) rej(err);

          return res(JSON.parse(content));
        }
      );
    });
  }

  static async getById(id) {
    const goods = await Good.getAll();
    return goods.find((good) => good.id === id);
  }
  
  static async update(good) {
    const goods = await Good.getAll();
    const index = goods.findIndex(g => g.id === good.id);

    goods[index] = good;

    return new Promise((res, rej) => {
      fs.writeFile(
        path.join(__dirname, '../data/goods.json'),
        JSON.stringify(goods),
        (err) => {
          if (err) rej(err);
          res();
        }
      );
    });
  }

  static async remove(id) {
    let goods = await Good.getAll();

    goods = goods.filter(good => good.id !== id);

    return new Promise((res, rej) => {
      fs.writeFile(
        path.join(__dirname, '../data/goods.json'),
        JSON.stringify(goods),
        (err) => {
          if (err) rej(err);
          res();
        }
      );
    });
  }
}

module.exports = Good;
