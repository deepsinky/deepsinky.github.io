  const input = document.getElementById("input");
const chat = document.getElementById("chat");

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

    let response = await fetch("https://openrouter.ai/api/v1/chat/completions",{
      method:"POST",
      headers:{
        "Authorization": "Bearer sk-or-xxxxxxxxxxxx", // 👈 apni real API key daalo
        "Content-Type":"application/json",
        "HTTP-Referer": window.location.origin, // 🔥 FIX
        "X-Title":"DeepSINKY"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "user", content: text }
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
    let reply = data?.choices?.[0]?.message?.content || "No response 😢";

    typeText(botDiv, reply);

  }catch(err){

    console.error("ERROR:", err);

    // 🔥 ERROR SHOW USER KO
    thinking.innerHTML = "❌ " + err.message;

  }

  chat.scrollTop = chat.scrollHeight;
}


// ✨ TYPING EFFECT (IMPROVED)
function typeText(element, text){

  let i = 0;
  element.innerHTML = "";

  function typing(){
    if(i < text.length){
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, 10);
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
