const mongoose = require('../config/connect');
const bcrypt = require('bcrypt');

const amdminSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Name cannot be empty"],
  },
  password: {
    type: String,
    required: [true, "Password cannot be empty"],
    minlength: [6, 'Password should be at least 6 characters long'],
  },
  refershToken:String,
  Role:{
    type:String,
    default:"admin"
  },
}, { timestamps: true });

amdminSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password') || user.isNew) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    }
    next();
  });
const AdminModle = mongoose.model('admin', amdminSchema);





module.exports = AdminModle;
