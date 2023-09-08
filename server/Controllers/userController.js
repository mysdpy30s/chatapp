const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  // id에 secret key를 생성하여 데이터베이스에 저장되도록 함
  const jwtkey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

// 프론트엔드 쪽에서 유저 가입정보가 들어오면, 여기서 처리함. 중복 여부 확인도 하고.
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await userModel.findOne({ email }); // 해당 이메일을 사용하는 유저 확인

    if (user)
      return res.status(400).json("User with the given email already exists."); // 해당 이메일 사용하는 유저가 이미 있을 경우 해당 에러 출력
    // 400은 유저 관련 에러를 의미

    if (!name || !email || !password)
      return res.status(400).json("All fields are required."); // 이름, 이메일, 비밀번호 중 하나라도 공란일 경우 해당 에러 출력

    if (!validator.isEmail(email))
      return res.status(400).json("Email must be a valid email."); // 유효한 이메일 형식이 아닐 경우 해당 에러 출력

    if (!validator.isStrongPassword(password))
      return res.status(400).json("Password must be a strong password."); // 강력한 비밀번호 아니면 해당 에러 출력

    user = new userModel({ name, email, password });

    const salt = await bcrypt.genSalt(10); // 입력된 비밀번호를 hash?하는 기능. 랜덤한 10개의 문자를 섞어서 보안 강화
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name, email, token }); // 200은 문제 없음을 의미하며, post가 정상적으로 이루어지면 이 내용을 담은 메시지가 출력될 것임.
  } catch (error) {
    console.log(error);
    res.status(500).json(error); // 500은 서버 에러를 의미
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email }); // 로그인 시 로그인 정보가 잘못되면 아래 에러 출력

    if (!user) return res.status(400).json("Invalid email or password.");

    const isValidPassword = await bcrypt.compare(password, user.password); // DB에 저장된 비밀번호와 로그인시 입력된 비밀번호를 서로 비교.
    if (!isValidPassword)
      return res.status(400).json("Invalid email or password.");

    const token = createToken(user._id); // 로그인이 잘되면 아래 내용 출력.
    res.status(200).json({ _id: user._id, name: user.name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await userModel.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find(); // user 전체를 find

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { registerUser, loginUser, findUser, getUsers };
