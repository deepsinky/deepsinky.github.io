const input = document.getElementById("input");
const chat = document.getElementById("chat");

let messages = [];
input.addEventListener("keypress", function(e){
  if(e.key === "Enter"){
    send();
  }
});

async function send(){

  let text = input.value.trim();
  if(text === "") return;

  document.getElementById("welcome").style.display="none";
  chat.style.display="block";

  // USER MESSAGE
  chat.innerHTML += `<div class="message user">${text}</div>`;
  input.value = "";

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
  body: JSON.stringify({
    messages: [
      {
        role: "system",
        content: "Reply with emojis, bullet points, and bold text like ChatGPT"
      },
      {
        role: "user",
        content: text
      }
    ]
  })
}); 
    // 🔥 REAL ERROR SHOW
    if(!response.ok){
      let errText = await response.text();
      throw new Error(errText);
    }

    let data = await response.json();
    console.log("API RESPONSE:", data);

    thinking.remove();

    // BOT MESSAGE BOX
    let botDiv = document.createElement("div");
    botDiv.className = "message bot";
    chat.appendChild(botDiv);

    // SAFE RESPONSE
    let reply = data.reply || "No response 😢";

    typeText(botDiv, formatText(reply));

  }catch(err){

    console.error("ERROR:", err);

    // 🔥 ERROR SHOW USER KO
    thinking.innerHTML = "❌ " + err.message;

  }

  chat.scrollTop = chat.scrollHeight;
}
function formatText(text){
  return text
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\n/g, "<br>")
    .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
}

// ✨ TYPING EFFECT (IMPROVED)
function typeText(element, text){
  let i = 0;
  element.innerHTML = "";

  let formatted = formatText(text);

  function typing(){
    if(i < formatted.length){
      element.innerHTML = formatted.slice(0, i);
      i++;
      setTimeout(typing, 15);
    }
    chat.scrollTop = chat.scrollHeight;
  }

  typing();
}

// 📱 SIDEBAR
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


// ❌ REMOVE THIS (annoying popup)
// alert("JS loaded");
