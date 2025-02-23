// models.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userInteractionSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  action_type: {
    type: String,
    enum: ['viewed', 'purchased'],
    required: true
  },
  timestamp: { type: Date, default: Date.now }
});

const UserInteraction = mongoose.model('UserInteraction', userInteractionSchema);

module.exports = { UserInteraction };
