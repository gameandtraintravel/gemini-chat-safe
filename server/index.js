// server/index.js
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage }] }]
            })
        });

        const data = await response.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "응답 없음";
        res.json({ reply });
    } catch (error) {
        res.status(500).json({ error: "서버 오류" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`서버 실행 중: ${PORT}`));
