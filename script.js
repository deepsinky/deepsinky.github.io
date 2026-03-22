async function send(){

  let text = input.value.trim();
  if(text === "") return;

  document.getElementById("welcome").style.display="none";
  chat.style.display="block";

  chat.innerHTML += `<div class="message user">${text}</div>`;
  input.value = "";

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
        message: text
      })
    });

    if(!response.ok){
      let errText = await response.text();
      throw new Error(errText);
    }

    let data = await response.json();
    let reply = data.reply; // ✅ correct

    thinking.remove();

    let botDiv = document.createElement("div");
    botDiv.className = "message bot";
    chat.appendChild(botDiv);

    typeText(botDiv, reply);

  }catch(err){

    console.error("ERROR:", err);
    thinking.innerHTML = "❌ " + err.message;

  }

  chat.scrollTop = chat.scrollHeight;
}
