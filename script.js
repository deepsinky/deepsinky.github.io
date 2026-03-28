document.addEventListener("DOMContentLoaded", function(){

  const input = document.getElementById("input");
  const chat = document.getElementById("chat");
  const sendBtn = document.getElementById("sendBtn");
  const mic = document.querySelector(".mic");

  // 👉 NEW (SIDEBAR STORAGE)
  let history = JSON.parse(localStorage.getItem("chatHistory")) || [];

  // =========================
  // SEND EVENTS
  if(sendBtn){
    sendBtn.addEventListener("click", send);
  }

  if(input){
    input.addEventListener("keypress", function(e){
      if(e.key === "Enter") send();
    });
  }

  // =========================
  // 🎤 VOICE INPUT + WAVE
  if(mic){
    mic.onclick = ()=>{
      let wave = document.createElement("div");
      wave.className = "voice-wave";
      wave.innerHTML = "<span></span><span></span><span></span><span></span>";
      input.parentNode.appendChild(wave);

      let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = "en-US";
      recognition.start();

      input.placeholder = "Listening...";

      recognition.onresult = function(e){
        input.value = e.results[0][0].transcript;
        wave.remove();
        input.placeholder = "Ask DeepSINKY";
      };
    };
  }

  // =========================
  async function send(){

    let text = input.value.trim();
    if(!text) return;

    document.getElementById("welcome")?.style.display = "none";
    chat.style.display = "block";

    // USER MESSAGE
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
    thinking.innerHTML = `<div class="wave"><span></span><span></span><span></span></div>`;
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

      // BOT MESSAGE
      let botDiv = document.createElement("div");
      botDiv.className = "message bot";

      botDiv.innerHTML = `
        <div class="content">
          <div class="text"></div>
        </div>
      `;

      chat.appendChild(botDiv);

      let textBox = botDiv.querySelector(".text");

      streamText(textBox, reply);

      // 👉 SAVE HISTORY
      history.push(text);
      localStorage.setItem("chatHistory", JSON.stringify(history));

      loadHistory();

    }catch(err){
      thinking.innerHTML = "❌ Server error";
    }

    scrollBottom();
  }

  // =========================
  // STREAMING TEXT
  function streamText(el, text){

    let formatted = formatText(text);
    let words = formatted.split(" ");
    let i = 0;

    function type(){
      if(i < words.length){
        el.innerHTML += words[i] + " ";
        el.innerHTML += `<span class="cursor">|</span>`;
        i++;
        setTimeout(type, 25);
      }else{
        el.innerHTML = formatted;
        addCopyButtons();
      }
      scrollBottom();
    }

    el.innerHTML = "";
    type();
  }

  // =========================
  function formatText(text){
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
      .replace(/\n/g, "<br>")
      .replace(/- (.*?)(<br>|$)/g, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>");
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

  function scrollBottom(){
    chat.scrollTop = chat.scrollHeight;
  }

  // =========================
  // 👉 SIDEBAR LOAD
  function loadHistory(){
    let sidebar = document.getElementById("sidebar");
    if(!sidebar) return;

    sidebar.innerHTML = "";

    history.forEach(item=>{
      let div = document.createElement("div");
      div.className = "side-item";
      div.innerText = item;
      sidebar.appendChild(div);
    });
  }

  loadHistory();

});

// =========================
// 👉 SIDEBAR TOGGLE
function toggleSidebar(){
  let sidebar = document.getElementById("sidebar");
  let overlay = document.getElementById("overlay");

  if(!sidebar || !overlay) return;

  sidebar.classList.toggle("open");
  overlay.classList.toggle("show");
}
