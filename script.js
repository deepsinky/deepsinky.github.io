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
    chat.innerHTML += `
  <div class="message user">
    <div class="bubble">
      ${text}
    </div>
  </div>
`;
    input.value = "";

    // THINKING
    let thinking = document.createElement("div");
    thinking.className = "message bot";
    thinking.innerHTML = "Thinking<span class='dots'></span>";
document.addEventListener("DOMContentLoaded", function(){

  const input = document.getElementById("input");
  const chat = document.getElementById("chat");
  const sendBtn = document.getElementById("sendBtn");

  sendBtn.onclick = send;
  input.addEventListener("keypress", e=>{
    if(e.key === "Enter") send();
  });

  // =========================
  async function send(){

    let text = input.value.trim();
    if(!text) return;

    const welcome = document.getElementById("welcome");
    if(welcome) welcome.style.display = "none";

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

      let reply = data.reply || "No response 😢";
      let textBox = botDiv.querySelector(".text");

      typeText(textBox, reply);

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
    let i = 0;

    function typing(){
      if(i < formatted.length){
        element.innerHTML = formatted.slice(0, i);
        i++;
        setTimeout(typing, 10);
      } else {
        addCopyButtons(); // 🔥 auto copy
      }
      scrollBottom();
    }

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
  alert("Copied!");
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
