const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    usertype:{type: String, require: true },
    name: { type: String, require: true },
    image: {
        type: String,
        default:
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      },
    email: { type: String, require: true, unique: true },
    phone: { type: String, unique: true },
    password: { type: String, require: true },
  },
  { timestamps: true }
);



const User = mongoose.model("User", userSchema);
module.exports = User;
