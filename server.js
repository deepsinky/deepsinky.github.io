import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "*"
}));
app.use(express.json());

const API_KEY = process.env.API_KEY;

app.post("/chat", async (req,res)=>{

try{

const message = req.body.message;
const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.API_KEY}`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
contents:[{parts:[{text:message}]}]
})
}
);

const data = await response.json();

const reply =
data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

res.json({reply});

}catch(err){

res.json({reply:"Server error"});

}

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
console.log("DeepSINKY AI server running on port 3000");
});
console.log("API KEY:", process.env.API_KEY);
console.log("FULL DATA:", JSON.stringify(data));
app.get("/", (req, res) => {
  res.send("Server is running");
});
