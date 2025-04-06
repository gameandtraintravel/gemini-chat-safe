const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;

// ✅ Netlify 주소를 명시적으로 허용
app.use(cors({
  origin: "https://kimjunsu-ai.netlify.app",
  methods: ["POST"],
}));

app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }]
        })
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "응답 없음";
    res.json({ reply });
  } catch (error) {
    console.error("Gemini API 오류:", error);
    res.status(500).json({ reply: "오류 발생" });
  }
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
