import { useContext } from "react";
import { Container, Stack } from "react-bootstrap";
import ChatBox from "../components/chat/ChatBox";
import PotentialChats from "../components/chat/PotentialChats";
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

// Chat 관련 기능 route
const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading, updateCurrentChat } =
    useContext(ChatContext);

  return (
    <Container>
      <PotentialChats />
      {userChats?.length < 1 ? null : (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
            {isUserChatsLoading && <p>Loading chats...</p>}
            {userChats?.map((chat, index) => {
              return (
                <div key={index} onClick={() => updateCurrentChat(chat)}>
                  <UserChat chat={chat} user={user} />
                </div>
              );
            })}
          </Stack>
          <ChatBox />
        </Stack>
      )}
    </Container>
  ); // Chat이 없는 상태면 .length < 1 일거니까 그거에 맞는 조건문을 적어줌.
  // className="~~~" 은 bootstrap에서 제공하는 속성임. pe-3 : padding end 를 3으로 줌

  // 23번 행 : 현재 열려있는 Chat을 클릭하면 updateCurrentChat 기능이 실행되면서, 다시 그 Chat을 업데이트해서 보여준다.
};

export default Chat;
