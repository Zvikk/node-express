const { Schema, model } = require('mongoose');

const good = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  amount: {
    type: Number
  },
  image: {
    type: String
  }
})

module.exports = model('Good', good);