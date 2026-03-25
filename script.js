document.addEventListener("DOMContentLoaded", function(){

  const input = document.getElementById("input");
  const chat = document.getElementById("chat");
  const sendBtn = document.getElementById("sendBtn");

  if(sendBtn){
    sendBtn.addEventListener("click", send);
  }

  if(input){
    input.addEventListener("keypress", function(e){
      if(e.key === "Enter"){
        send();
      }
    });
  }

  // =========================
  async function send(){

    let text = input.value.trim();
    if(text === "") return;

    const welcome = document.getElementById("welcome");
    if(welcome) welcome.style.display = "none";

    chat.style.display = "block";

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
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text
        })
      });

      if(!response.ok){
        let errText = await response.text();
        throw new Error(errText);
      }

      let data = await response.json();

      thinking.remove();

      // BOT MESSAGE
let botDiv = document.createElement("div");
botDiv.className = "message bot";

botDiv.innerHTML = `
  <div class="text"></div>

  <div class="actions">
    <span onclick="copyText(this)">📋</span>
    <span onclick="likeMsg(this)">👍</span>
    <span onclick="speakText(this)">🔊</span>
    <span onclick="shareText(this)">🔗</span>
  </div>
`;

chat.appendChild(botDiv);
let textBox = botDiv.querySelector(".text");
typeText(textBox, reply);
      let reply = data.reply || "No response 😢";

      typeText(botDiv.querySelector(".text"), reply);

    }catch(err){
      console.error("ERROR:", err);
      thinking.innerHTML = "❌ " + err.message;
    }

    // ✅ सही जगह
    chat.scrollTop = chat.scrollHeight;

  } // 👈 send() यहीं बंद होगा

  // =========================
  function formatText(text){
    return text
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\n/g, "<br>")
      .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
  }

  // =========================
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

}); // 👈 DOMContentLoaded end

// ===== SIDEBAR =====
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
