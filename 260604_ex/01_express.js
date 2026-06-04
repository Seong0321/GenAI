// commonjs es-module
const express = require("express");
// 자동으로 안잡히면 터미널에서 `npm i express`를 안한 것
const PORT = 3333;

const app = express(); // 호출

app.get("/", (req, res) => {
  //
  res.send("안녕하세요 GET 요청은 처음");
});

app.listen(3000, () => {
  console.log("3000에서 서버 실행 중");
});
// 터미널에
// node 01_express.js
