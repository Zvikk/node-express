const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1
        },
        goodId: {
          type: Schema.Types.ObjectId,
          ref: 'Good',
          required: true
        }
      }
    ]
  }
});

userSchema.methods.addToCart = function (good) {
  const items = [...this.cart.items];

  const goodIndex = items.findIndex(g => g.goodId.toString() === good._id.toString());

  if (goodIndex >= 0) {
    items[goodIndex].count = items[goodIndex].count + 1;
  } else {
    items.push({
      goodId: good._id,
      count: 1
    })
  }

  this.cart = { items };

  return this.save();
}

userSchema.methods.removeFromCart = function (goodId) {
  let items = [...this.cart.items];

  items = items.filter(good => good.goodId.toString() !== goodId.toString());

  this.cart = {items};
  
  return this.save();
}

module.exports = model('User', userSchema);
