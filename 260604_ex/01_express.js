// commonjs es-module
const express = require("express");
// 자동으로 안잡히면 터미널에서 `npm i express`를 안한 것

const app = express(); // 호출
const PORT = 3333;

// body -> post json parser.
// post, put, patch -> body가 있는 형태로 구현한다
// get, delete는 body가 없는 형태로 구현한다
app.use(express.json())

app.get("/", (req, res) => {
  // (요청패러미터, 응답패러미터)
  //   res.send("안녕하세요 GET 요청은 처음이라...");
  res.send("안녕하세요 GET 요청은 이제 익숙해요!");
});

// https://www.postman.com/
app.post("/", (req, res) => {
  res.json({
    msg: "어머 POST도 가능하네요",
  });
});

app.post("/chat", (req, res) => {
  const { msg } = req.body; // payload -> req.body -> 서버
  res.json({
    reply: `${msg}라고 말씀하셨네요`,
  });
});

// node 01_express.js -> listen까지만 구현한 코드를 기반으로 실행 중
// 코드 변동사항을 watch(감지)해주는 실행 방법이 필요함
// 1. node 내장 --watch (22+ LTS)
// 2. nodemon 설치해서 사용
// 기존 서버는 ctrl + c 로 종료
// npm i -D nodemon
// npx nodemon 01_express.js
/*
  "scripts": {
    "01": "nodemon 01_express.js"
  },
*/
// # npm run {script 이름}
// npm run 01

// 이미 실행 중인 3000 포트가 있다면 3001이나 3333 등 대체 포트로 실행
app.listen(PORT, () => {
  //   console.log("3000에서 서버 실행 중");
  console.log(`${PORT}에서 서버 실행 중`);
});
// 터미널에
// node 01_express.js