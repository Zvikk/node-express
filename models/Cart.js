const { Schema, model } = require('mongoose');

const cart = new Schema({
  price: {
    type: Number,
    required: true
  }
})

module.exports = model('Cart', cart);