const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose");
const socket=require("socket.io")

const app=express();
require("dotenv").config();
const userRoutes=require("./routes/userRoutes")
const messageRoutes=require("./routes/messageRoutes")

app.use(cors())
app.use(express.json())

app.use("/api/auth",userRoutes)
app.use("/api/messages",messageRoutes)


mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("DB Connection Successful")
}).catch((err)=>{
    console.log(err.message)
})

const server=app.listen(process.env.PORT,()=>{
    console.log(`erver started on port ${process.env.PORT}`);

})

const io=socket(server,{
    cors:{
        origin: `http://${process.env.HOST}:3000`,
        credentials:true
    }
})

global.onlineUsers=new Map();

io.on("connection",(socket)=>{
    global.chatSocket=socket
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id)
    })
    // console.log(onlineUsers)

    socket.on("send-msg",(data)=>{
        const sendUserSocket=onlineUsers.get(data.to)
        console.log(data)
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-receive",data.message)
            // console.log("emit msg-receive")
        }
    })
})