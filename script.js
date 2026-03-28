document.addEventListener("DOMContentLoaded", function(){

  const input = document.getElementById("input");
  const chat = document.getElementById("chat");
  const sendBtn = document.getElementById("sendBtn");

  let history = JSON.parse(localStorage.getItem("chatHistory")) || [];
  let memory = JSON.parse(localStorage.getItem("memory")) || {};

  sendBtn.onclick = send;

  input.addEventListener("keypress", function(e){
    if(e.key === "Enter") send();
  });

  // 🎤 VOICE INPUT
  const mic = document.querySelector(".mic");
  if(mic){
    mic.onclick = ()=>{
      let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = "en-US";
      recognition.start();

      recognition.onresult = function(e){
        input.value = e.results[0][0].transcript;
      };
    };
  }

  // =========================
  async function send(){

    let text = input.value.trim();
    if(!text) return;

    document.getElementById("welcome")?.style.display = "none";
    chat.style.display = "block";

    // ✅ USER (NO BUBBLE)
    chat.innerHTML += `
      <div class="message user">
        <div class="text">${text}</div>
      </div>
    `;

    input.value = "";
    scrollBottom();

    // THINKING
    let thinking = document.createElement("div");
    thinking.className = "message bot";
    thinking.innerHTML = "Thinking<span class='dots'></span>";
    chat.appendChild(thinking);

    try{

      let response = await fetch("https://deepsinky-server-1.onrender.com/chat",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ message:text })
      });

      let data = await response.json();
      thinking.remove();

      let reply = data.reply || "No response 😢";

      // 🧠 MEMORY
      if(text.includes("my name is")){
        let name = text.split("my name is")[1].trim();
        memory.name = name;
        localStorage.setItem("memory", JSON.stringify(memory));
      }

      if(memory.name){
        reply = "Hello " + memory.name + " 👋\n\n" + reply;
      }

      // BOT MESSAGE
      let botDiv = document.createElement("div");
      botDiv.className = "message bot";

      botDiv.innerHTML = `
        <div class="content">
          <div class="text"></div>

          <div class="actions">
            <span onclick="copyText(this)">📋</span>
            <span onclick="likeMsg(this)">👍</span>
            <span onclick="speakText(this)">🔊</span>
            <span onclick="shareText(this)">🔗</span>
          </div>
        </div>
      `;

      chat.appendChild(botDiv);

      let textBox = botDiv.querySelector(".text");

      typeText(textBox, reply);

      // 📜 SAVE HISTORY
      history.push({q:text, a:reply});
      localStorage.setItem("chatHistory", JSON.stringify(history));

      loadHistory();

    }catch(err){
      thinking.innerHTML = "❌ " + err.message;
    }

    scrollBottom();
  }

  // =========================
  function formatText(text){
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
      .replace(/\n/g, "<br>");
  }

  // =========================
  function typeText(element, text){

    let formatted = formatText(text);
    let words = formatted.split(" ");
    let i = 0;

    function typing(){
      if(i < words.length){
        element.innerHTML += words[i] + " ";
        i++;
        setTimeout(typing, 30);
      }else{
        addCopyButtons();
      }
      scrollBottom();
    }

    element.innerHTML = "";
    typing();
  }

  // =========================
  function addCopyButtons(){
    document.querySelectorAll("pre").forEach(block=>{
      if(block.querySelector(".copy-btn")) return;

      let btn = document.createElement("span");
      btn.innerText = "Copy";
      btn.className = "copy-btn";

      btn.onclick = ()=>{
        navigator.clipboard.writeText(block.innerText);
        btn.innerText = "Copied!";
      };

      block.appendChild(btn);
    });
  }

  // =========================
  function scrollBottom(){
    chat.scrollTop = chat.scrollHeight;
  }

  // =========================
  function loadHistory(){
    let sidebar = document.getElementById("sidebar");
    if(!sidebar) return;

    sidebar.innerHTML = "";

    history.forEach(item=>{
      let div = document.createElement("div");
      div.className = "side-item";
      div.innerText = item.q;
      sidebar.appendChild(div);
    });
  }

  loadHistory();

});

// ===== SIDEBAR =====
function toggleSidebar(){
  let sidebar = document.getElementById("sidebar");
  let overlay = document.getElementById("overlay");

  sidebar.classList.toggle("open");
  overlay.classList.toggle("show");
}

// ===== ACTION BUTTONS =====

function copyText(el){
  let text = el.closest(".content").querySelector(".text").innerText;
  navigator.clipboard.writeText(text);
}

function likeMsg(el){
  el.innerHTML = "❤️";
}

function speakText(el){
  let text = el.closest(".content").querySelector(".text").innerText;
  let speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speechSynthesis.speak(speech);
}

function shareText(el){
  let text = el.closest(".content").querySelector(".text").innerText;
  if(navigator.share){
    navigator.share({ text });
  } else {
    alert("Share not supported");
  }
}

// 🌗 THEME SWITCH
function toggleTheme(){
  document.body.classList.toggle("light");
}
