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
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: userText
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Gemini response empty";

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
