const mongoose = require('mongoose');
const { validator } = require('express');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        validator.isURL(v, { protocols: ['http', 'https', 'ftp'], require_tld: true, require_protocol: true });
      },
      message: 'Аватар должен быть ссылкой (URL)!',
    },
  },

  owner: {
    type: mongoose.ObjectId,
    required: true,
  },

  likes: {
    type: [mongoose.ObjectId],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
