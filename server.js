import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Jarvish backend is running");
});

app.post("/ai", async (req, res) => {
  try {
    const userText = req.body.text;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userText }]
            }
          ]
        })
      }
    );

    const data = await response.json();

// 🔥 DEBUG LOG
console.log("FULL GEMINI RESPONSE 👇");
console.log(JSON.stringify(data, null, 2));

if (data.error) {
  return res.json({
    reply: "Gemini ERROR: " + data.error.message
  });
}

const reply =
  data.candidates &&
  data.candidates[0] &&
  data.candidates[0].content &&
  data.candidates[0].content.parts &&
  data.candidates[0].content.parts[0] &&
  data.candidates[0].content.parts[0].text
    ? data.candidates[0].content.parts[0].text
    : "Gemini replied but NO TEXT";

res.json({ reply });
  } catch (err) {
    console.error(err);
    res.json({ reply: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Jarvish backend running on port", PORT);
});
