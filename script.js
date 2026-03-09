async function send(){

let input=document.getElementById("input")
let text=input.value

if(text==="") return

let chat=document.getElementById("chat")

chat.innerHTML+=`<div class="user">${text}</div>`

input.value=""

let response=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAAF70PBNSCuCj87A0DUZ6DF4frUGluVXE,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
contents:[
{
parts:[{text:text}]
}
]
})

})

let data=await response.json()

let reply=data.candidates[0].content.parts[0].text

chat.innerHTML+=`<div class="bot">${reply}</div>`

}
