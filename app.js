const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
    console.log(`App server on PORT ${PORT}`)
})

const io = require('socket.io')(server)


app.use(express.static(__dirname + '/public'))

let socketsConnected = new Set()

io.on('connection', onConnected)

function onConnected(socket) {
    socketsConnected.add(socket.id)

    io.emit('clients-total', socketsConnected.size)

    socket.on('disconnect', () => {
        // console.log('Socket disconected', socket.id)
        socketsConnected.delete(socket.id)
        io.emit('clients-total', socketsConnected.size)
    })

    socket.on('message', (data) => {
        console.log(data)
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('feedback', (data) => {
        console.log('data', data)
        socket.broadcast.emit('feedback', data)
    })
}