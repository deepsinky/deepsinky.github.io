const input = document.getElementById("input");
const chat = document.getElementById("chat");

input.addEventListener("keypress", function(e){
if(e.key==="Enter"){
send();
}
});

async function send(){

let text = input.value.trim();
if(text==="") return;

document.getElementById("welcome").style.display="none";
chat.style.display="block";

chat.innerHTML += `<div class="message user">${text}</div>`;

input.value="";

chat.innerHTML += `<div class="message bot">Thinking...</div>`;

let response = await fetch("http://localhost:3000/chat",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({message:text})
});

let data = await response.json();

chat.lastChild.remove();

chat.innerHTML += `<div class="message bot">${data.reply}</div>`;

chat.scrollTop = chat.scrollHeight;

}
