const input = document.getElementById("input");
const chat = document.getElementById("chat");
const sendBtn = document.getElementById("send"); // 👈 ADD THIS

// ENTER KEY
input.addEventListener("keypress", function(e){
  if(e.key === "Enter"){
    send();
  }
});

// SEND BUTTON CLICK
if(sendBtn){
  sendBtn.addEventListener("click", send);
}

async function send(){

  let text = input.value.trim();
  if(text === "") return;

  document.getElementById("welcome").style.display="none";
  chat.style.display="block";

  // USER MESSAGE
  chat.innerHTML += `<div class="message user">${text}</div>`;

  input.value="";

  // THINKING
  let thinking = document.createElement("div");
  thinking.className = "message bot";
  thinking.innerHTML = "Thinking<span class='dots'></span>";
  chat.appendChild(thinking);

  try{

    let response = await fetch("https://deepsinky-server-1.onrender.com/chat",{
  method:"POST",
  headers:{
    "Content-Type":"application/json"
  },
  body:JSON.stringify({message:text})
});

// 👇 YAHAN ADD KARO
console.log("STATUS:", response.status);

let data = await response.json();

// 👇 YAHAN ADD KARO
console.log("DATA:", data);
    // SAFE REPLY
    let reply = data.reply;

    if (!reply || reply === "No response") {
      reply = "⚠️ Server se response nahi aaya";
    }

    // REMOVE THINKING
    thinking.remove();

    // BOT MESSAGE
    let botDiv = document.createElement("div");
    botDiv.className = "message bot";
    chat.appendChild(botDiv);

    typeText(botDiv, reply);

  } catch(err){

    console.log("FRONT ERROR:", err);
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
