import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Jarvish backend running ✅");
});

app.post("/ai", async (req, res) => {
  try {
    const userText = req.body.text;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ reply: "❌ API KEY missing" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userText }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("FULL GEMINI RESPONSE 👇");
    console.log(JSON.stringify(data, null, 2));

    if (data.error) {
      return res.json({
        reply: "Gemini ERROR: " + data.error.message
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Gemini replied but no text";

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.json({ reply: "Server error" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server listening on port", PORT);
});
