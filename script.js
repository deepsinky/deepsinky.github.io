async function send(){

let input = document.getElementById("userInput").value;

let chatbox = document.getElementById("chatbox");

chatbox.innerHTML += "<p><b>You:</b> "+input+"</p>";

let response = await fetch("https://api.openai.com/v1/chat/completions",{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":"Bearer YOUR_API_KEY"
},
body:JSON.stringify({
model:"gpt-4",
messages:[{role:"user",content:input}]
})
});

let data = await response.json();

let reply = data.choices[0].message.content;

chatbox.innerHTML += "<p><b>AI:</b> "+reply+"</p>";

}
