const { Schema, model } = require('mongoose');

const order = new Schema({
  goods: [{
    good: {
      type: Object,
      required: true
    },
    count: {
      type: Number,
      required: true
    }
  }],
  user: {
    name: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = model('Order', order);