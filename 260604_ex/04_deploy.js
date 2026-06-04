// 의존성
require("dotenv").config();
const express = require("express");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");
const GroqAI = require("groq-sdk");

// 전역변수
const app = express();
const { GEMINI_API_KEY, GROQ_API_KEY, PORT } = process.env;
const genAI = new GoogleGenAI(GEMINI_API_KEY);
const groq = new GroqAI({ apiKey: GROQ_API_KEY });

app.use(express.json());

// 파일들에 대한 접근을 /public에 대해서 열어두겠다 (/public은 제외한 뒤에 경로들)
app.use(express.static(path.join(__dirname, "public")));

app.post("/chat", async (req, res) => {
  // 입력 (JSON)
  const { provider, model, ask } = req.body;
  console.log("provider", provider);
  console.log("model", model);
  console.log("ask", ask);
  // 로직 (AI Provider)
  let result;
  try {
    console.log("[서버 요청 시작]");
    switch (true) {
      case provider === "google":
        console.log("google 제공자 요청");
        result = await useGoogle(model, ask);
        break;
      case provider === "groq":
        console.log("groq 제공자 요청");
        result = await useGroq(model, ask);
        break;
      default:
        console.log("잘못된 Provider");
        return res.status(404).json({ msg: "존재하지 않는 Provider" });
    }
    console.log("[서버 요청 완료]");
    // 출력 (JSON)
    res.json({ result });
  } catch (error) {
    console.error("AI 요청 중 에러 발생:", error);
    res.status(500).json({
      error: "AI 응답을 생성하는 중 오류가 발생했습니다.",
    });
  }
});

async function useGoogle(model, ask) {
  const modelInstance = genAI.getGenerativeModel({ model });
  const result = await modelInstance.generateContent(ask);
  const response = await result.response;
  return response.text();
}

async function useGroq(model, ask) {
  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: ask }],
    model,
  });
  return response.choices[0].message.content;
}

app.listen(PORT, () => {
  console.log(`${PORT}에서 실행`);
});
