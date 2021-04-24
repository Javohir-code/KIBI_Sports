const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 2,
    maxlength: 50,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    minlength: 2,
    maxlength: 50,
    trim: true,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    validate: {
      validator: (val) => {
        return val >= 18;
      },
      message: "Warning! Age should be above 18",
    },
  },
  msisdn: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
});

userSchema.methods.generateAuthToken = () => {
  const token = jwt.sign({ _id: this._id }, process.env.TOKEN_SECRET);
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
