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

    // Sahi URL: v1 ki jagah v1beta aur model name gemini-1.5-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
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
    });

    const data = await response.json();

    // Agar Google koi error bhejta hai (jaise 404 ya 400)
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return res.json({ reply: "Error: " + data.error.message });
    }

    // Response nikalne ka sahi tarika
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";
    
    res.json({ reply });

  } catch (err) {
    console.error("Server Error:", err);
    res.json({ reply: "Server error ho gaya hai" });
  }
});
      
