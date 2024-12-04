const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  roles: [{ type: String, required: true }], 
});


const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true, default: () => Date.now() + 5 * 60 * 1000 },
});


userSchema.statics.createUser = async function (user) {
  const { name, email, password, mobile, roles } = user;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new this({
      name,
      email,
      password: hashedPassword,
      mobile,
      roles,
  });

  return await newUser.save();
};

userSchema.statics.findByEmail = async function (email) {
  return await this.findOne({ email }).exec();
};

userSchema.statics.findById = async function (userId) {
  return await this.findById(userId).exec();
};

userSchema.statics.update = async function (userId, updatedData) {
  const updatedUser = await this.findByIdAndUpdate(userId, updatedData, { new: true });
  return updatedUser;
};

userSchema.statics.delete = async function (userId) {
  return await this.findByIdAndDelete(userId);
};

userSchema.statics.findByRole = async function (role) {
  return await this.find({ roles: role }).exec();
};

userSchema.statics.countByRole = async function (role) {
  return await this.countDocuments({ roles: role }).exec();
};
;

otpSchema.statics.saveOtp = async function (email, otp) {
  const newOtp = new this({ email, otp, expiresAt: Date.now() + 5 * 60 * 1000 });
  return await newOtp.save();
};

otpSchema.statics.findOtpByEmail = async function (email) {
  return await this.findOne({ email, expiresAt: { $gt: Date.now() } }).sort({ createdAt: -1 }).exec();
};

otpSchema.statics.deleteOtp = async function (email) {
  return await this.deleteMany({ email }).exec();
};

const User = mongoose.model('User', userSchema);
const OTP = mongoose.model('OTP', otpSchema);

module.exports = { User, OTP };
