const socket = io()

const clientsTotal = document.querySelector('#clients-total')
const messageContainer = document.querySelector('#message-container')
const nameInput = document.querySelector('#name-input')
const messageForm = document.querySelector('#message-form')
const messageInput = document.querySelector('#message-input')

// const messageTone = new Audio('/message-tone.mp3')

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage();
})
socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total Clients: ${data}`
});

function sendMessage() {
    if(messageInput.value === '') return

    const data = {
        name: nameInput.value != "" ? nameInput.value : 'Anonymous',
        message: messageInput.value,
        dateTime: new Date()
    }
    socket.emit('message', data)
    addMessageToUI(true, data)

    messageInput.value = ''
    scrollToBottom();
}

socket.on('chat-message', (data) => {
    // messageTone.play()
    addMessageToUI(false, data)
    scrollToBottom()
})

function addMessageToUI(isOwnMessage, data) {
    const element = `
            <li class="${isOwnMessage ? "message-right" : "message-left"}">
                <p class="message"> 
                    ${data.message}
                    <span>${data.name} - ${moment(data.dateTime).fromNow()}</span>
                </p>
            </li>
    `

    messageContainer.innerHTML += element;
}

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: `${nameInput.value ? nameInput.value : 'Anonymous'} is typing a message`
    })
})
messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: `${nameInput.value ? nameInput.value : 'Anonymous'} is typing a message`
    })
})
messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: ''
    })
})

socket.on('feedback', (data) => {
    clearFeedback()
    const element = `
            <li class="message-feedback">
                <p class="feedback" id="feedback">
                    ${data.feedback}
                </p>
            </li>
    `
    messageContainer.innerHTML += element
    scrollToBottom()
})

function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach(elm => {
        elm.parentNode.removeChild(elm);
    })
}