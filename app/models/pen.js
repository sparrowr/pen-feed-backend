const mongoose = require('mongoose')

const penSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  isInked: {
    type: Boolean,
    required: true
  },
  isClean: {
    type: Boolean,
    required: true
  },
  changedYear: {
    type: Number,
    required: false
  },
  changedMonth: {
    type: Number,
    required: false
  },
  changedDay: {
    type: Number,
    required: false
  },
  inkName: {
    type: String,
    required: false
  },
  inkType: {
    type: String,
    required: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Pen', penSchema)
