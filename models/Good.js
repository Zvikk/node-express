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
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
})

good.method('toClient', function() {
  const good = this.toObject();

  good.id = good._id;
  delete good._id;

  return good;
})

module.exports = model('Good', good);