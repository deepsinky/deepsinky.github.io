import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "YOUR_GEMINI_API_KEY";

app.post("/chat", async (req, res) => {

const message = req.body.message;

const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
{
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
contents: [{ parts: [{ text: message }] }]
})
}
);

const data = await response.json();

res.json({
reply: data.candidates[0].content.parts[0].text
});

});

app.listen(3000, () => {
console.log("DeepSINKY server running");
});
