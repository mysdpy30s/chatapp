const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
      unique: true,
    }, // 이메일로 로그인시킬거기 때문에 unique 해야함
    password: { type: String, required: true, minlength: 3, maxlength: 1024 },
  },
  {
    timestamps: true,
  }
); // 유저 관련하여 받아올 새로운 객체데이터를 생성

const userModel = mongoose.model("User", userSchema); // 여기서 "User"는 실제 MongoDB 내의 Collection 이름으로 저장됨.

module.exports = userModel;
