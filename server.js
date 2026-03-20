import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("FULL DATA:", JSON.stringify(data, null, 2));

    // 🔥 FINAL FIX (IMPORTANT)
    let reply = "";

    if (data.candidates && data.candidates.length > 0) {
      let parts = data.candidates[0].content.parts;
      reply = parts.map(p => p.text).join("");
    } else if (data.error) {
      reply = "API Error: " + data.error.message;
    } else {
      reply = "No response";
    }

    res.json({ reply });

  } catch (err) {
    console.log("ERROR:", err);
    res.json({ reply: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("DeepSINKY AI server running on port " + PORT);
});

// health check
app.get("/", (req, res) => {
  res.send("Server is running");
});
