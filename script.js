// 🔥 DeepSINKY PRO SCRIPT

document.addEventListener("DOMContentLoaded", function(){

  const input = document.getElementById("input");
  const chat = document.getElementById("chat");
  const sendBtn = document.getElementById("sendBtn");
  const mic = document.querySelector(".mic");

  // =========================
  // ✅ SEND BUTTON
  if(sendBtn){
    sendBtn.addEventListener("click", send);
  }

  // ✅ ENTER KEY
  if(input){
    input.addEventListener("keypress", function(e){
      if(e.key === "Enter") send();
    });
  }

  // =========================
  // 🎤 VOICE INPUT
  if(mic){
    mic.onclick = ()=>{
      let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = "en-US";
      recognition.start();

      input.placeholder = "Listening...";

      recognition.onresult = function(e){
        input.value = e.results[0][0].transcript;
        input.placeholder = "Ask DeepSINKY";
      };
    };
  }

  // =========================
  // 🧠 FEATURE DETECTION
  function detectFeature(text){

    text = text.toLowerCase();

    if(text.includes("translate")) return "translate";
    if(text.includes("summarize")) return "summary";
    if(text.includes("code") || text.includes("html")) return "coding";
    if(text.includes("story") || text.includes("poem")) return "creative";
    if(text.includes("email")) return "email";
    if(text.includes("resume")) return "resume";
    if(text.includes("plan")) return "planner";
    if(text.includes("explain")) return "education";

    return "general";
  }

  // =========================
  // 🤖 AI CALL
  async function askAI(prompt, type="general"){

    let response = await fetch("https://deepsinky-server-1.onrender.com/chat",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        message: prompt,
        mode: type
      })
    });

    if(!response.ok){
      throw new Error("Server not responding");
    }

    let data = await response.json();
    return data.reply;
  }

  // =========================
  // 🚀 SEND FUNCTION
  async function send(){

    let text = input.value.trim();
    if(!text) return;

    document.getElementById("welcome")?.style.display = "none";
    chat.style.display = "block";

    let mode = detectFeature(text);

    addUserMessage(text);
    input.value = "";
    scrollBottom();

    let thinking = addThinking();

    try{

      let reply = await askAI(text, mode);

      thinking.remove();
      addBotMessage(reply);

    }catch(err){
      thinking.innerHTML = "❌ Server error / API issue";
    }

    scrollBottom();
  }

  // =========================
  // 💬 USER MESSAGE
  function addUserMessage(text){
    chat.innerHTML += `
      <div class="message user">
        <div class="text">${text}</div>
      </div>
    `;
  }

  // =========================
  // 🤖 BOT MESSAGE
  function addBotMessage(text){

    let div = document.createElement("div");
    div.className = "message bot";

    div.innerHTML = `
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

    chat.appendChild(div);

    let textBox = div.querySelector(".text");

    streamText(textBox, text);
  }

  // =========================
  // 🤔 THINKING
  function addThinking(){
    let div = document.createElement("div");
    div.className = "message bot";
    div.innerHTML = "Thinking...";
    chat.appendChild(div);
    return div;
  }

  // =========================
  // ⚡ STREAMING TEXT
  function streamText(el, text){

    let words = text.split(" ");
    let i = 0;

    function type(){
      if(i < words.length){
        el.innerHTML += words[i] + " <span class='cursor'>|</span>";
        i++;
        setTimeout(type, 25);
      }else{
        el.innerHTML = formatText(text);
        addCopyButtons();
      }
      scrollBottom();
    }

    el.innerHTML = "";
    type();
  }

  // =========================
  // 🧾 FORMAT TEXT
  function formatText(text){
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
      .replace(/\n/g, "<br>");
  }

  // =========================
  // 📋 COPY BUTTON
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

}); // DOM END

// =========================
// 📂 SIDEBAR
function toggleSidebar(){
  let sidebar = document.getElementById("sidebar");
  let overlay = document.getElementById("overlay");

  if(!sidebar || !overlay) return;

  sidebar.classList.toggle("open");
  overlay.classList.toggle("show");
}

// =========================
// 🔘 ACTION BUTTONS
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
  }else{
    alert("Share not supported");
  }
}

// =========================
// 🌗 THEME
function toggleTheme(){
  document.body.classList.toggle("light");
}
