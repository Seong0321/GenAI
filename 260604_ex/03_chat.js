// 환경변수 불러오기
require("dotenv").config();
// .env -> 환경변수에 주입
// npm run 03
// injected env (2) from .env

// 의존성
const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const Groq = require("groq-sdk");

// 전역변수
const PORT = 3434;
const app = express();
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const groqAI = new Groq({ apiKey: process.env.GROQ_API_KEY });

//대화
app.post("/chat/gen", (req, res) => {
  res.json({ msg: "GoogleGenAI" });
});
app.post("/chat/groq", (req, res) => {
  res.json({ msg: "GroqAI" });
});

// 서버 활성화 (연결할 포트 지정)
app.listen(PORT, () => {
  console.log(`${PORT}로 연결됨`);
});