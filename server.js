import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Jarvish backend running with Groq ✅");
});

app.post("/ai", async (req, res) => {
  try {
    const userText = req.body.text;

    if (!process.env.GROQ_API_KEY) {
      return res.json({ reply: "❌ Groq API key missing" });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            { role: "system", content: "You are Jarvish, a helpful AI assistant." },
            { role: "user", content: userText }
          ]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.json({ reply: "Groq ERROR: " + data.error.message });
    }

    const reply =
      data.choices?.[0]?.message?.content || "No reply from Groq";

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
