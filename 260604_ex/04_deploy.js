// 의존성
require("dotenv").config();
const express = require("express");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");
const GroqAI = require("groq-sdk");

// 전역변수
const app = express();
const { GEMINI_API_KEY, GROQ_API_KEY, PORT } = process.env;
const google = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
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
      res.status(404).json({ msg: "존재하지 않는 Provider" });
      return;
  }
  console.log("[서버 요청 완료]");
  // 출력 (JSON)
  res.json({
    result,
  });
});

app.post("/api/fortune", async (req, res) => {
  const { name, birthdate, birthtime, gender, type, provider, model } = req.body;
  console.log("fortune request:", { name, birthdate, birthtime, gender, type, provider, model });
  
  const timeText = birthtime ? `, 태어난 시간: ${birthtime}` : '';
  const ask = `사용자의 이름은 ${name}이고, 성별은 ${gender}이며, 생년월일은 ${birthdate}${timeText}입니다.
이 사용자의 오늘의 '${type}'(종합/재물/연애/성공/건강 중 하나) 운세를 사주오행 및 점성술 관점에서 재미있고 디테일하게 분석해주세요.

답변은 반드시 아래와 같이 JSON 형식의 문자열로만 응답해 주세요. (마크다운 코드 블록 등 다른 부가 설명 없이 순수한 JSON 내용만 출력되어야 합니다. 그렇지 않으면 파싱에 실패합니다.)

{
  "summary": "오늘의 운세 요약 한 줄",
  "score": 85, 
  "detail": "디테일한 운세 설명 내용 (2~3개 문단 정도로 친절하고 상세하게 작성)",
  "luckyColor": "행운의 색상",
  "luckyNumber": "행운의 숫자",
  "luckyDirection": "행운의 방향",
  "luckyItem": "행운의 아이템"
}`;

  let resultText;
  try {
    console.log("[서버 운세 요청 시작]");
    if (provider === "google") {
      // 사용할 수 있는 적절한 Google 모델 기본값 설정
      resultText = await useGoogle(model || "gemini-2.5-flash", ask);
    } else if (provider === "groq") {
      resultText = await useGroq(model || "llama-3.3-70b-versatile", ask);
    } else {
      return res.status(400).json({ error: "올바르지 않은 provider입니다." });
    }
    console.log("[서버 운세 요청 완료]");
    
    let jsonString = resultText.trim();
    if (jsonString.startsWith("```")) {
      jsonString = jsonString.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }
    
    const fortuneData = JSON.parse(jsonString);
    res.json(fortuneData);
  } catch (error) {
    console.error("운세 생성 중 에러 발생:", error);
    res.status(500).json({ 
      error: "운세를 생성하거나 분석하는 중에 오류가 발생했습니다.", 
      message: error.message,
      raw: resultText 
    });
  }
});


async function useGoogle(model, ask) {
  const response = await google.models.generateContent({
    model, // 못 쓰는 모델은 예외처리될 예정
    contents: ask,
  });
  return response.text;
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