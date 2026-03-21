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

    let response = await fetch("https://deepsinky-server-1.onrender.com/chat", {
      method:"POST",
      headers:{
        "Authorization": "Bearer YOUR_OPENROUTER_API_KEY",
        "Content-Type":"application/json",
        "HTTP-Referer":"https://deepsinky.github.io",
        "X-Title":"DeepSINKY"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "user", content: text }
        ]
      })
    });

    if(!response.ok){
      throw new Error("API error");
    }

    let data = await response.json();
    console.log(data); // DEBUG

    thinking.remove();

    // BOT MESSAGE BOX
    let botDiv = document.createElement("div");
    botDiv.className = "message bot";
    chat.appendChild(botDiv);

    // SAFE RESPONSE
    let reply = data?.choices?.[0]?.message?.content || "No response 😢";

    typeText(botDiv, reply);

  }catch(err){

    console.error(err);
    thinking.innerHTML = "Error aa gaya 😢";

  }

  chat.scrollTop = chat.scrollHeight;
}


// ✨ TYPING EFFECT
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
async function send(){

  try {
    let response = await fetch("https://deepsinky-server-1.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    // 🔥 retry अगर fail हो
    if (!response.ok) {
      await new Promise(r => setTimeout(r, 2000));

      response = await fetch("https://deepsinky-server-1.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: text })
      });
    }

    let data = await response.json();
    let reply = data.reply || "No response";

    typeText(botDiv, reply);

  } catch (err) {
    thinking.innerHTML = "⚠️ Server waking up... try again";
  }
}

// DEBUG
alert("JS loaded");
