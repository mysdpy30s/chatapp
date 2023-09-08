import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const {
    registerInfo,
    updateRegisterInfo,
    registerUser,
    registerError,
    isRegisterLoading,
  } = useContext(AuthContext);

  return (
    <>
      <Form onSubmit={registerUser}>
        <Row
          style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Col xs={6}>
            <Stack gap={3}>
              <h2>Register</h2>

              <Form.Control
                type="text"
                placeholder="Name"
                onChange={(e) =>
                  updateRegisterInfo({ ...registerInfo, name: e.target.value })
                }
              />
              <Form.Control
                type="email"
                placeholder="Email"
                onChange={(e) =>
                  updateRegisterInfo({ ...registerInfo, email: e.target.value })
                }
              />
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  updateRegisterInfo({
                    ...registerInfo,
                    password: e.target.value,
                  })
                }
              />
              <Button variant="primary" type="submit">
                {isRegisterLoading ? "Creating your account." : "Register"}
              </Button>
              {registerError?.error && (
                <Alert variant="danger">
                  <p>{registerError?.message}</p>
                </Alert>
              )}
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};
// <Row>에 스타일을 추가하여 가운데 정렬, 패딩 등을 추가했고,
// <Col>에 xs={6}을 추가해서 입력창이 가로로 너무 길어지지 않도록 크기를 조절했음. xs는 xsmall 이라는 뜻.
// <Stack>은 기본값이 수직 정렬임. 마치 flex-direction:column 같은 용도.
// <Button>에서 variant="primary" 뜻은 버튼 중 가장 중요한 버튼이라는 것을 의미. 중요도에 따라 primary - secondary - tertiary 순으로 지정하면 되고, 이 중요도에 따라서 버튼의 생김새가 달라짐.
export default Register;
