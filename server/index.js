// root for our application
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");

const app = express();
require("dotenv").config(); // 이 코드로 .env 파일 내의 내용을 아래 변수에서 가져와 사용할 수 있도록 함.

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
  res.send("Welcome to our chatapp API!");
});

const port = process.env.PORT || 5500;
const uri = process.env.ATLAS_URI;

app.listen(port, (req, res) => {
  console.log(`Server running on port: ${port}`);
});

mongoose // MongoDB와 연결시켜주고, 연결이 되거나 실패할 경우 해당하는 메시지를 출력시킴.
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established."))
  .catch((error) => console.log("MongoDB connection failed: ", error.message));
