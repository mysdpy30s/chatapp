export const baseUrl = "http://localhost:5500/api";

export const postRequest = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // json 데이터를 사용할 것이라고 명시
    },
    body,
  });

  const data = await response.json();

  // 받아온 data를 return하기 전에 아래 if문을 통해서 이상 없는지 체크. 만약 이상이 없다면 아래 return data 부분의 코드로 점프하여 바로 실행될 것이다.
  if (!response.ok) {
    let message;
    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }
    return { error: true, message };
  }

  return data;
};

export const getRequest = async (url) => {
  const response = await fetch(url); // backend 서버로부터 response를 url로 받아옴.
  const data = await response.json();
  if (!response.ok) {
    let message = "An error occurred.";

    if (data?.message) {
      message = data.message;
    }

    return { error: true, message };
  }

  return data;
};
