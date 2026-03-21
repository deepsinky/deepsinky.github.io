document.addEventListener("DOMContentLoaded", function(){

const input = document.getElementById("input");
const chat = document.getElementById("chat");
const sendBtn = document.getElementById("sendBtn");

//  BUTTON CLICK FIX
if(sendBtn){
  sendBtn.addEventListener("click", send);
}

//  ENTER KEY
input.addEventListener("keypress", function(e){
  if(e.key === "Enter"){
    send();
  }
});

async function send(){

  let text = input.value.trim();
  if(text === "") return;

  document.getElementById("welcome").style.display = "none";
  chat.style.display = "block";

  chat.innerHTML += `<div class="message user">${text}</div>`;
  input.value = "";

  let thinking = document.createElement("div");
  thinking.className = "message bot";
  thinking.innerHTML = "Thinking<span class='dots'></span>";
  chat.appendChild(thinking);

  try{

    console.log("Sending request...");

    let response = await fetch("https://deepsinky-server-1.onrender.com/chat",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({message:text})
    });

    console.log("STATUS:", response.status);

    let data = await response.json();

    console.log("DATA:", data);

    thinking.remove();

    let reply = data.reply || "⚠️ No reply from server";

    let botDiv = document.createElement("div");
    botDiv.className = "message bot";
    chat.appendChild(botDiv);

    typeText(botDiv, reply);

  }catch(err){

    console.log("ERROR:", err);
    thinking.innerHTML = "Server error";

  }

  chat.scrollTop = chat.scrollHeight;
}

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

alert("JS loaded");

});
