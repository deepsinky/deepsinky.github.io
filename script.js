// 🔥 DeepSINKY PRO SCRIPT

document.addEventListener("DOMContentLoaded", function(){
const languages = [

/* 🇮🇳 INDIA LANGUAGES */
"Hindi","English","Bengali","Telugu","Marathi","Tamil","Urdu","Gujarati",
"Kannada","Odia","Malayalam","Punjabi","Assamese","Maithili","Santali",
"Kashmiri","Nepali","Sindhi","Konkani","Dogri","Manipuri","Bodo",
"Sanskrit","Tulu","Garhwali","Khasi","Mizo","Naga","Ladakhi",

/* 🌍 WORLD LANGUAGES */
"English","Spanish","French","German","Italian","Portuguese","Dutch",
"Russian","Chinese","Japanese","Korean","Arabic","Turkish","Persian",
"Greek","Hebrew","Polish","Swedish","Norwegian","Finnish","Danish",
"Czech","Hungarian","Romanian","Bulgarian","Ukrainian","Serbian",
"Croatian","Slovak","Slovenian","Estonian","Latvian","Lithuanian",

/* 🌏 ASIA */
"Thai","Vietnamese","Indonesian","Malay","Filipino","Sinhala",
"Burmese","Khmer","Lao","Mongolian","Kazakh","Uzbek","Tajik",
"Pashto","Dari","Armenian","Georgian","Azerbaijani",

/* 🌍 AFRICA */
"Swahili","Zulu","Xhosa","Yoruba","Igbo","Hausa","Amharic",
"Somali","Shona","Sesotho","Tswana","Tigrinya",

/* 🌎 AMERICA */
"English (US)","Spanish (Latin)","French (Canada)",
"Quechua","Guarani","Haitian Creole",

/* 🌐 EXTRA GLOBAL */
"Icelandic","Irish","Welsh","Albanian","Maltese","Luxembourgish",
"Faroese","Basque","Catalan","Galician","Corsican","Breton",
"Esperanto","Latin"

/* 👉 total ~120–150 depending duplicate remove */
];
  const input = document.getElementById("input");
  const chat = document.getElementById("chat");
  const sendBtn = document.getElementById("sendBtn");
  const mic = document.querySelector(".mic");
// =========================
// 🧠 STYLE DETECTION ENGINE
function detectStyle(text){

  text = text.toLowerCase();

  let styles = [];

  // 🧠 RESPONSE STYLES
  if(text.includes("formal")) styles.push("formal");
  if(text.includes("casual") || text.includes("informal")) styles.push("casual");
  if(text.includes("friendly")) styles.push("friendly");
  if(text.includes("strict")) styles.push("strict");
  if(text.includes("motivate")) styles.push("motivational");
  if(text.includes("story")) styles.push("storytelling");
  if(text.includes("teach") || text.includes("explain")) styles.push("teaching");
  if(text.includes("step")) styles.push("step-by-step");
  if(text.includes("short")) styles.push("short");
  if(text.includes("detail")) styles.push("detailed");
  if(text.includes("bullet")) styles.push("bullet");
  if(text.includes("hinglish")) styles.push("hinglish");
  if(text.includes("hindi")) styles.push("hindi");
  if(text.includes("english")) styles.push("english");
  if(text.includes("funny")) styles.push("humor");
  if(text.includes("logic")) styles.push("logical");
  if(text.includes("debate")) styles.push("debate");

  // 💻 CODING
  if(text.includes("code")) styles.push("coding");
  if(text.includes("debug")) styles.push("debug");

  // 📚 STUDY
  if(text.includes("notes")) styles.push("notes");
  if(text.includes("exam")) styles.push("exam");
  if(text.includes("revision")) styles.push("revision");

  // 🎨 CREATIVE
  if(text.includes("poem") || text.includes("shayari")) styles.push("poetry");
  if(text.includes("script")) styles.push("script");

  // 🌐 LANGUAGE
  if(text.includes("translate")) styles.push("translate");
  if(text.includes("grammar")) styles.push("grammar");

  // ⚙️ PRODUCTIVITY
  if(text.includes("resume")) styles.push("resume");
  if(text.includes("plan")) styles.push("planner");
  if(text.includes("idea")) styles.push("ideas");

  // 🔍 INTELLIGENCE
  if(text.includes("solve")) styles.push("problem-solving");
  if(text.includes("compare")) styles.push("comparison");

  return styles.length ? styles : ["general"];
}
  
  // =========================
  function buildStylePrompt(text, styles){

  let prompt = text + "\n\n";

  styles.forEach(style=>{

    switch(style){

      case "formal":
        prompt += "Answer in formal professional tone.\n";
        break;

      case "casual":
        prompt += "Answer in casual friendly tone.\n";
        break;

      case "motivational":
        prompt += "Make response motivational and inspiring.\n";
        break;

      case "storytelling":
        prompt += "Explain like a story.\n";
        break;

      case "teaching":
        prompt += "Explain like a teacher in simple way.\n";
        break;

      case "step-by-step":
        prompt += "Give step by step explanation.\n";
        break;

      case "short":
        prompt += "Keep answer short.\n";
        break;

      case "detailed":
        prompt += "Give detailed explanation.\n";
        break;

      case "bullet":
        prompt += "Use bullet points.\n";
        break;

      case "hinglish":
        prompt += "Reply in Hinglish.\n";
        break;

      case "hindi":
        prompt += "Reply in Hindi.\n";
        break;

      case "english":
        prompt += "Reply in English.\n";
        break;

      case "humor":
        prompt += "Make it funny.\n";
        break;

      case "logical":
        prompt += "Use logical reasoning.\n";
        break;

      case "coding":
        prompt += "Give clean code with explanation.\n";
        break;

      case "debug":
        prompt += "Explain debugging clearly.\n";
        break;

      case "notes":
        prompt += "Make notes format.\n";
        break;

      case "exam":
        prompt += "Answer exam oriented.\n";
        break;

      case "poetry":
        prompt += "Write in poetry style.\n";
        break;

      case "script":
        prompt += "Write like a script.\n";
        break;

      case "translate":
        prompt += "Translate properly.\n";
        break;

      case "resume":
        prompt += "Create professional resume.\n";
        break;

      case "planner":
        prompt += "Make structured plan.\n";
        break;

      case "ideas":
        prompt += "Generate creative ideas.\n";
        break;

      case "problem-solving":
        prompt += "Solve step by step.\n";
        break;

      case "comparison":
        prompt += "Compare clearly.\n";
        break;
    }

  });

  return prompt;
}
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

    // ✅ ALWAYS REMOVE THINKING
    if(thinking) thinking.remove();

    addBotMessage(reply);

  }catch(err){

    // ❌ REMOVE thinking first
    if(thinking) thinking.remove();

    // ✅ show error as message
    addBotMessage("❌ Server error. Try again.");

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

  div.innerHTML = `<div class="dot"></div>`;

  chat.appendChild(div);
  scrollBottom();
  return div;
  }

  // =========================
  // ⚡ STREAMING TEXT
  function streamText(el, text){

  let words = text.split(" ");
  let i = 0;

  el.innerHTML = "";

  function type(){
    if(i < words.length){

      el.innerHTML += words[i] + " ";
      i++;

      scrollBottom();   // 🔥 यही final fix है

      setTimeout(type, 20);

    }else{
      el.innerHTML = formatText(text);
      addCopyButtons();
    }
  }

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
  requestAnimationFrame(()=>{
    chat.scrollTop = chat.scrollHeight;
  });
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
