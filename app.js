import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path'

const app = express();
const PORT = process.env.PORT || 4005   ;
const server = createServer(app);
const io = new Server(server);

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
console.log("Hi")

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

app.get ("/",(req,res)=>{
    res.sendFile(path.join(process.cwd(), "public", "idex.html"))
})

let socketConnected = new Set()

io.on("connection",onConnected);

function onConnected(socket){
    console.log(socket.id)
    socketConnected.add(socket.id)
    socket.emit("Socket_mssg","CLIENT IS CONNECTED")
    
    io.emit('Total-clients',socketConnected.size)

    socket.on("disconnect",()=>{
        console.log("Client is disconnect ",socket.id)
        socketConnected.delete(socket.id)
        io.emit('Total clients',socketConnected.size)
    })

    socket.on("Client-Mssg",(data)=>{
        console.log(data)
        socket.broadcast.emit("chat-message",data)
    })

     socket.on("feedback",(msg)=>{
            
         socket.broadcast.emit("feedback_mssg",msg)
     })
}

   

   

