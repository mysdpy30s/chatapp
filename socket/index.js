const { Server } = require("socket.io");

const io = new Server({ cors: "https://stellular-sawine-179873.netlify.app" });
// cors:"도메인" 을 입력해줌으로써, 이 서버가 저 지정된 도메인과만 communicate 하도록 설정해줌.

let onlineUsers = [];

// 아래의 .on 메소드는 listen과 같은 역할로, connection 이벤트를 연결해준다.
io.on("connection", (socket) => {
  console.log("new connection", socket.id);

  // listen to a connection
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) && // 이 유저가 온라인이면 아래 코드로 넘어가, 해당 유저의 id와 socketId를 onlineUsers 배열에 저장한다.
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    console.log("onlineUsers", onlineUsers);

    io.emit("getOnlineUsers", onlineUsers); // emit 메소드를 통해 getOnlineUsers 이벤트를 trigger하고 onlineUsers 데이터를 전달한다.
  });

  // add message ; this code checks if the recipient is online based on the onlineUsers array and then emits the "getMessage" event to the recipient's socket. This allows the message to be sent directly to the online recipient. If the user is undefined, it means the recipient is not online, and the message won't be sent to them in real-time.
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  // 접속중인 유저가 나가면(disconnect 되면), 다시 getOnlineUsers 이벤트를 trigger하여 onlineUsers 데이터를 전달한다. (즉, 실시간으로 접속 상태가 반영되게 한다.)
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3000);
