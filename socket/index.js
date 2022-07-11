const io = require("socket.io")(8900,{
    cors:{
        origin:"http://localhost:3000 "
    }
});

let users = [];

const addUser = (userId,socketId)=>{
    !users.some((user)=>user.userId === userId) &&
    users.push({userId,socketId});
};

const removeUser=(socketId)=>{
    users = users.filter(user=>user.socketId !==socketId )
};

const getUser = ((userId)=>{
    return users.find(user=>user.userId === userId);
})

io.on("connection",(socket)=>{
    //when connect
    console.log("a user connected");
    socket.emit("welcome","this is socket server")
    //take userId and socketId from user
    socket.on("addUser",(userId)=>{
        addUser(userId,socket.id);
        io.emit("getUsers",users);

        
    });
    //send and get msgs
    socket.on("sendMessage",({userId,receiverId,text})=>{
        const user = getUser(userId);
        io.to(user.socketId).emit("getMessage",{
            senderId,
            text,
        })

    })
    //when disconnect 
    socket.on("disconnected",()=>{
        console.log("a user disconnected");
        removeUser(socket.id);
        io.emit("getUsers",users); 
    })
});