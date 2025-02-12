    const socket = io()

    const totalClient = document.getElementById("clients-total")
    const socketMssg = document.getElementById("socket-mssg")
    const messageContainer = document.getElementById("message-container")
    const nameInput = document.getElementById("name-input")
    const messageForm = document.getElementById("message-form")
    const messageInput = document.getElementById("message-input")
    const sendButton = document.getElementById("send-button")





    messageForm.addEventListener("submit",(e)=>{
    
        e.preventDefault()              
        if(messageInput.value){
        sendMessage()
        }
        
    
    })



    function sendMessage(){
        console.log(messageInput.value)
        
        const data = {
            name : nameInput.value,
            message : messageInput.value,
            date : new Date()
        }
        socket.emit('Client-Mssg',data)
        messageUi(true,data)
        messageInput.value = ""
        scrollBottom()
    }
    
    
    socket.on("chat-message",(data)=>{
        console.log(data)
        messageUi(false,data)
        scrollBottom()
        feedbackRemove()
    })

    
    socket.on('Total-clients',(data)=>{
        totalClient.innerText = `Total Clients : ${data}`
    })
    
    socket.on("Socket_mssg", (msg) => {
        socketMssg.innerText = `${msg}!!!`;
        
        // 1 second ke baad message hata do
        setTimeout(() => {
            socketMssg.innerText = "";
        }, 2000);
    });
    function messageUi(isOwnMssg, data){
        const element = `
        <li class="${isOwnMssg ? 'message-right' : 'message-left'}">
        <p class="message">
        ${data.message}
        <span>${data.name} ● ${moment(data.date).fromNow()}</span>
        </p>
        </li>
        `
        
        messageContainer.innerHTML += element
    }
    
    function scrollBottom(){
        messageContainer.scrollTo(0,messageContainer.scrollHeight)
    }
    
     messageInput.addEventListener("focus",(e)=>{
        
         socket.emit("feedback",`${nameInput.value} is typing....`)
     })
     let typingTimer;

     messageInput.addEventListener("keypress", () => {
         clearTimeout(typingTimer); // Pehle ka timer reset karo  
         socket.emit("feedback", `${nameInput.value} is typing...`); // Ek hi baar emit karo
         
         // 500ms tak agar koi aur keypress nahi hoti, toh message remove kar do
         typingTimer = setTimeout(() => {
             socket.emit("feedback", ""); 
         }, 1500);
     });
     
     messageInput.addEventListener("blur",(e)=>{
         socket.emit("feedback","")
     })
    
     socket.on("feedback_mssg",(msg)=>{
        feedbackRemove()
         const element =` <li class="message-feedback">
                <p class="feedback" id="feedback">
                   ${msg}
                </p>
            </li>`
            messageContainer.innerHTML += element
     })

     function feedbackRemove() {
        document.querySelectorAll('.message-feedback').forEach(element => {
            element.remove();
        });
    }
    