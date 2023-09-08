import { useCallback } from "react";
import { createContext, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";
import { useEffect } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  console.log("Userr", user);
  console.log("loginInfo", loginInfo);

  //아래의 useEffect 코드를 넣어, Register 창에서 정보 입력 후 가입이 된 후에도, 해당 정보가 계속 localStorage에 남아있게끔 만들어줌. (새로고침해도 Console창에 그대로 떠있음.)
  useEffect(() => {
    const user = localStorage.getItem("User");

    setUser(JSON.parse(user));
  }, []);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []); // info = Register form에 들어온 정보를 받아 업데이트 한다.
  //useCallback: useMemo 는 특정 결과값을 재사용 할 때 사용하는 반면, useCallback 은 특정 함수를 새로 만들지 않고 재사용하고 싶을때 사용(첫번째 인자로 넘어온 함수를, 두번째 인자로 넘어온 배열 내의 값이 변경될 때까지 저장해놓고 재사용할 수 있게 해줌)

  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault(); // Register.jsx의 Submit하는 버튼과 연결되어 있는데, 누를때마다 기본적으로 화면 refresh를 해서, 이 기본 기능이 작동되지 않도록 이 코드를 넣어줌.
      setIsRegisterLoading(true); // Register 프로세스가 진행중이라는걸 셋업.
      setRegisterError(null);

      const response = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(registerInfo)
      ); //여기에서 받아온 정보를 JSON 문자로 변환시킨 뒤, services.js에서의 postRequest 함수를 동작시켜서 데이터 이상여부에 따라 에러메시지를, 또는 해당 데이터를 출력한다.

      setIsRegisterLoading(false);

      if (response.error) {
        return setRegisterError(response);
      }

      localStorage.setItem("User", JSON.stringify(response)); // User정보를 localStorage에 저장시켜서, 사이트 내의 어디든 이동할때 새로 로그인 할 필요없게 함.
      setUser(response);
    },
    [registerInfo]
  );

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();

      setIsLoginLoading(true);
      setLoginError(null);

      const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(loginInfo)
      );

      setIsLoginLoading(false);

      if (response.error) {
        return setLoginError(response); // 만약 에러가 발생하면, 바로 에러를 출력
      }

      localStorage.setItem("User", JSON.stringify(response)); // 위에서 user 정보(loginInfo)를 잘 받아오면, 이 코드를 통해 localStorage에 해당 정보를 저장.
      setUser(response); // 그리고 setUser를 진행.
    },
    [loginInfo]
  ); // useCallback에서 첫번째 인수는 화살표 함수, 두번째 인수는 dependency Array임

  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        logoutUser,
        loginUser,
        loginError,
        loginInfo,
        updateLoginInfo,
        isLoginLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; // <AuthContext.Provider>는 value 라는 prop을 갖고 있는데, user data를 담고있는 `user` 속성이 담긴 객체 데이터를 전달해준다. 그리고 이 value prop은 <AuthContext.Provider>의 자식 요소인 컴포넌트에 데이터를 전달해준다.
// 리액트에서 'children' prop은 컴포넌트 트리의 어느 부분이 이 context 값에 접근할 수 있게 할지를 결정할 수 있는 것. 즉, <AuthContext.Provider> 태그 안에 들어가있는 컴포넌트나 내용들은 value라는 prop으로 전달된 context 값에 접근할 수 있다.
