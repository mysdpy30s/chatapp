import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

// 아래에서 user의 기본 state를 지정.
export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]); //현재 진행중인 Chat이 없어서 앞으로 언제라도 열릴 수 있는 Chat을 potentialChat으로 정의.
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  console.log("notifications", notifications);

  // initial socket
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // 더이상 이 socket을 사용하지 않거나, 또는 재 접속시 disconnect 기능을 이용해서 다시 빠르게 newSocket connection을 하도록 도와줌.
    };
  }, [user]);

  // add online Users
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id); // "addNewUser"라는 이벤트를 trigger시켜서, user?._Id를 socket/index.js의 addNewUser 함수의 매개변수로 전달한다.
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers"); // cleanup function ; This line defines a cleanup function that will be executed when the component unmounts or performs cleanup. Inside this cleanup function, it calls socket.off("getOnlineUsers") to remove the event listener for "getOnlineUsers". This ensures that you're not leaving any lingering event listeners that could cause issues when the component is no longer in use.
    };
  }, [socket]); // socket에 change가 감지될때마다 (=즉, 새 connection이 인식될때마다) 이 useEffect 함수를 실행시킨다.

  // send message
  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members?.find((id) => id !== user?._id);

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  // receive message and notification
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;

      setMessages((prev) => [...prev, res]);
    });

    // Notification 관련 설정. 이미 Chat이 open된 상태면 notification 알림이 뜨지 않도록 하고, 이미 읽은 것으로 표시하기.
    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);

      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);

      if (response.error) {
        return console.log("Error fetching users", response);
      }

      //아래의 pChats는 새로 Chat을 시작할 수 있는 유저들을 담은 Array임.
      const pChats = response.filter((u) => {
        let isChatCreated = false;
        if (user?._id === u._id) return false; //21행의 (u)에 들어온 current user가 현재 로그인한 유저와 동일할 경우, pChats(potential chat) array에 추가하지 않는다.

        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          }); // some 메소드는 boolean값으로 반환하는데, 만약 위에 (u)에 들어온 current user가 현재 Chat의 members에 포함되어 있다면(첫번째 Id이든 chat.members[0] or 두번째 Id이든 chat.members[1]) return으로 true 값을 반환할 것이고, 그러면 isChatCreated = true가 되어, 해당 유저와는 이미 Chat이 만들어진 상태가 된다.
        }

        return !isChatCreated; // 만약 isChatCreated가 false라면, 여기는 true로 반환될 것이고, 반대로 isChatCreated가 true라면 Chat은 이미 만들어진 상태이고 이 코드는 실행되지 않게 됨.
      });
      setPotentialChats(pChats);
      setAllUsers(response);
    };
    getUsers();
  }, [userChats]); // []안에 userChats를 넣어줌으로써, userChats에 어떤 change라도 생길 경우, 이 useEffect 함수는 다시 실행되게 된다.

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        // current user가 있으면 그 유저의 Chat을 가져온다

        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await getRequest(`${baseUrl}/chats/${user?._id}`); // 해당 유저의 id를 이용하여 chat을 불러온다.
        setIsUserChatsLoading(false);

        if (response.error) {
          return setUserChatsError(response);
        }

        setUserChats(response);
      }
    };
    getUserChats();
  }, [user]); // 여기 써진 useEffect 코드를 통해 user가 바뀔때마다 해당 Chat을 다시 불러온다.

  useEffect(() => {
    // Chat 상의 Message를 불러오는 함수
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);

      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}`
      );
      setIsMessagesLoading(false);

      if (response.error) {
        return setMessagesError(response);
      }

      setMessages(response);
    };
    getMessages();
  }, [currentChat]);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) return console.log("You must type something.");

      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
        })
      );

      if (response.error) {
        return setSendTextMessageError(response);
      }

      setNewMessage(response);
      setMessages((prev) => [...prev, response]); // 이전의 메시지 내역을 ... 연산자를 이용하여 쭉 나열해주고, 새로 보낸 메시지를 함께 출력해준다.
      setTextMessage(""); // 보내고나면 다시 기본 상태를 "" 빈문자로 초기화.
    },
    []
  );

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({
        firstId,
        secondId,
      })
    );
    if (response.error) {
      return console.log("Error creating chat", response);
    }

    setUserChats((prev) => [...prev, response]); // 에러가 발생하지 않아서 68~70행 코드를 패스하면 바로 이 줄 코드를 실행하는데, 이 코드의 역할은 setUserChats에 이전에 대화한 내역들을 ... 전개 연산자로 쭉 풀어주고, 거기에 더해 response를 추가로 출력시켜줌.
  }, []);

  const markAllNotificationsAsRead = useCallback((notifications) => {
    const mNotifications = notifications.map((n) => {
      return { ...n, isRead: true };
    });

    setNotifications(mNotifications);
  }, []);

  const markNotificationAsRead = useCallback(
    (n, userChats, user, notifications) => {
      //find chat to open
    },
    []
  );

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        currentChat,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
