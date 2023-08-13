const mongoose = require('mongoose');

const regex = /[(http(s)?)://(www.)?a-zA-Z0-9@:%.+~#=]{2,256}.[a-z]{2,6}([-a-zA-Z0-9@:%+.~#?&//=]*)/i;
const cardrSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value) => regex.test(value),
      message: (props) => `${props.value} is not a valid link!`,
    },
  },
});
const card = mongoose.model('card', cardrSchema);
module.exports = card;
