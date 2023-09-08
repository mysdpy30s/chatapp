import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { loginUser, loginError, loginInfo, updateLoginInfo, isLoginLoading } =
    useContext(AuthContext);

  return (
    <>
      <Form onSubmit={loginUser}>
        <Row
          style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Col xs={6}>
            <Stack gap={3}>
              <h2>Login</h2>

              <Form.Control
                type="email"
                placeholder="Email"
                onChange={(e) =>
                  updateLoginInfo({ ...loginInfo, email: e.target.value })
                }
              />
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  updateLoginInfo({ ...loginInfo, password: e.target.value })
                }
              />
              <Button variant="primary" type="submit">
                {isLoginLoading ? "Getting you in :)!" : "Login"}
              </Button>

              {loginError?.error && (
                <Alert variant="danger">
                  <p>{loginError?.message}</p>
                </Alert>
              )}
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};
// Register.jsx에서 쓰는 내용이랑 거의 다 동일해서 그대로 복붙해서 가져왔고, 로그인할때 Email/Password만 필요하니까 Name 입력창은 삭제함.
// <Row>에 스타일을 추가하여 가운데 정렬, 패딩 등을 추가했고,
// <Col>에 xs={6}을 추가해서 입력창이 가로로 너무 길어지지 않도록 크기를 조절했음. xs는 xsmall 이라는 뜻.
// <Stack>은 기본값이 수직 정렬임. 마치 flex-direction:column 같은 용도.
// <Button>에서 variant="primary" 뜻은 버튼 중 가장 중요한 버튼이라는 것을 의미. 중요도에 따라 primary - secondary - tertiary 순으로 지정하면 되고, 이 중요도에 따라서 버튼의 생김새가 달라짐.
export default Login;
