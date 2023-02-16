const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 4000
const server = app.listen(port, ()=> console.log(`Server running in ${port}`))

// import websocket
const io = require('socket.io')(server)

// menampilkan file index.html
app.use(express.static(path.join(__dirname, 'public')))

let socketsConected = new Set()

// kirim data ke client side
io.on('connection', onConnected)

function onConnected(socket){
    console.log("Socket Connected: ",socket.id);
    socketsConected.add(socket.id)

    // kirim data ke client side
    io.emit('clients-total', socketsConected.size)

    socket.on('disconnect', ()=>{
        console.log('Socket disconnected: ', socket.id);
        socketsConected.delete(socket.id)
        io.emit('clients-total', socketsConected.size)
    })

    // terima data dari client side
    socket.on('message', (data)=>{
        // kirim kembali ke client side
        console.log('data dari client: ', data);
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('feedback', (data)=>{
        socket.broadcast.emit('feedback', data)
    })

}