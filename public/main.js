const socket = io()

// ubah element by id in tag H3
const clientsTotal = document.getElementById('clients-total')
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

const messageTone = new Audio('./message-tone.mp3')

// event listener message form
messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    sendMessage()
})

// terima data dari server side
socket.on('clients-total', (data)=>{
    // console.log('clients connected: ',data);

    // menampilkan data ke client side
    clientsTotal.innerText = `Total Clients: ${data}`

})


function sendMessage(){
    if(messageInput.value==='') return
    // console.log('message input: ', messageInput.value);
    
    // ambil data dari client side
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    }

    // kirim data ke server side
    socket.emit('message', data)

    addMessageToUI(true, data)
    messageInput.value = ''
}

// terima data dari server side
socket.on('chat-message', (data)=>{
    // console.log('data chat dari server: ', data);
    messageTone.play()
    addMessageToUI(false, data)
})


function addMessageToUI(isOwnMessage, data){
    clearFeedback()
    const element = `
        <li class="${isOwnMessage ? "message-right" : "message-left"}">
            <p class="message">
                ${data.message}
                <span>${data.name} - ${moment(data.dateTime).fromNow()}</span>
            </p>
        </li>
    `

    messageContainer.innerHTML += element
    scrollToBottom()
}

function scrollToBottom(){
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('focus',(e)=>{
    socket.emit('feedback',{
        feedback:`🔭 ${nameInput.value} is typing a message ...`
    })
})

messageInput.addEventListener('keypress', (e)=>{
    socket.emit('feedback',{
        feedback:`🔭 ${nameInput.value} is typing a message ...`
    })
})

messageInput.addEventListener('blur', (e)=>{
    socket.emit('feedback',{
        feedback:''
    })
})


socket.on('feedback', (data)=>{
    clearFeedback()
    const element = `
        <li class="message-feedback">
            <p class="feedback" id="feedback">
                ${data.feedback}
            </p>
        </li>
    `
    messageContainer.innerHTML += element
})

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element=>{
        element.parentNode.removeChild(element)
    })
}