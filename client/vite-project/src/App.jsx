import { Routes, Route, Navigate } from "react-router-dom";
// Routes, Route, Navigate라는 Components를 react-router-dom에서 import해온다.
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import NavBar from "./components/NavBar";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <ChatContextProvider user={user}>
      <NavBar />
      <Container>
        <Routes>
          <Route path="/" element={user ? <Chat /> : <Login />} />
          <Route path="/register" element={user ? <Chat /> : <Register />} />
          <Route path="/login" element={user ? <Chat /> : <Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </ChatContextProvider>
    // 13번 행에서 AuthContext.jsx 파일을 통해 user 정보를 받아오게 되는데, user 정보가 있거나 null이거나 둘 중 하나임. 만약 user 정보가 잘 들어왔다면 Chat을, 아니면 각 메뉴를 보여주도록 한다(19번 행~21번 행까지)
    // 위에서 Chat, Register, Login이 아닌 다른 경로가 인식되면, 다시 "/" 홈으로 navigate 시킨다.
  );
}

export default App;
