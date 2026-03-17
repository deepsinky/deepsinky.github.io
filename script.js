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

// USER MESSAGE
chat.innerHTML += `<div class="message user">${text}</div>`;

input.value="";

// THINKING (single)
let thinking = document.createElement("div");
thinking.className = "message bot";
thinking.innerHTML = "Thinking<span class='dots'></span>";
chat.appendChild(thinking);

try{

let response = await fetch("http://localhost:3000/chat",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({message:text})
});

let data = await response.json();

// REMOVE THINKING
thinking.remove();

// BOT MESSAGE (typing effect)
let botDiv = document.createElement("div");
botDiv.className = "message bot";
chat.appendChild(botDiv);

typeText(botDiv, data.reply);

}catch{

thinking.innerHTML = "Server error";

}

chat.scrollTop = chat.scrollHeight;

}

// TYPING ANIMATION
function typeText(element, text){

let i = 0;

function typing(){

if(i < text.length){
element.innerHTML += text.charAt(i);
i++;
setTimeout(typing, 15);
}

chat.scrollTop = chat.scrollHeight;

}

typing();

}

// SIDEBAR TOGGLE
function toggleSidebar(){

let sidebar = document.getElementById("sidebar");
let overlay = document.getElementById("overlay");

if(!sidebar || !overlay){
alert("Sidebar missing");
return;
}

sidebar.classList.toggle("open");
overlay.classList.toggle("show");

}

// DEBUG
alert("JS loaded");
