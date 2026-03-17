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

let thinking = document.createElement("div");
thinking.className = "message bot";
thinking.innerHTML = "Thinking<span class='dots'></span>";
chat.appendChild(thinking);

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
function typeText(element, text){

let i = 0;

function typing(){

if(i < text.length){
element.innerHTML += text.charAt(i);
i++;
setTimeout(typing, 15); // speed (कम = fast, ज्यादा = slow)
}

chat.scrollTop = chat.scrollHeight;

}

typing();

}
function toggleSidebar(){

let sidebar = document.getElementById("sidebar");
let overlay = document.getElementById("overlay");

sidebar.classList.toggle("open");
overlay.classList.toggle("show");

}
alert("JS loaded");
