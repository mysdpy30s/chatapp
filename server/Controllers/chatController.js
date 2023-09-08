// createChat
const chatModel = require("../Models/chatModel");

const createChat = async (req, res) => {
  const { firstId, secondId } = req.body; // sender ID & receiver ID 두 개를 지칭. 채팅방에서는 두 명만 involve 되기 때문.

  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] }, //만약 chat의 member가 firstId, secondId 둘 다 포함하고 있을때. 여기서 $all은 MongoDB 전용 Operator. 둘 다 있어야한다는 조건을 거는 것임.
    });

    if (chat) return res.status(200).json(chat); // chat이 존재하면 이걸 그대로 출력한다.

    const newChat = new chatModel({
      members: [firstId, secondId],
    });

    const response = await newChat.save();

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// findUserChats
const findUserChats = async (req, res) => {
  // 현재 로그인 한 유저의 id를 url parameter를 통해 가져온다.
  const userId = req.params.userId;

  try {
    const chats = await chatModel.find({
      members: { $in: [userId] }, // MongoDB 전용 Operator로, 위에 사용된 $all은 다음의 모든 조건이 충족되어야 함을 의미 / 여기서 쓰인 $in은 하나만 있어도 됨을 의미. 즉, userId가 하나라도 있기만 하면 가져온다.
    });

    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// findChat (한 개의 채팅창만 불러오기)
const findChat = async (req, res) => {
  const { firstId, secondId } = req.params;

  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { createChat, findUserChats, findChat };
