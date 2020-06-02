const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const usernames = []

server.listen(process.env.PORT || 3000);
console.log('server runnung');

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html')
})

//connect to socket
io.sockets.on('connection',(socket)=>{
   console.log('Socket Connected...')

   socket.on('new user', (data, callback)=>{
       if (usernames.indexOf(data) != -1){
           callback(false);
       }else{
           callback(true);
           socket.username = data;
           usernames.push(socket.username);
           updateUsernames();
       }
       
   });
   //update Usernames
   function updateUsernames(){
       io.sockets.emit('usernames', usernames)
   };
   
   //send Message
   socket.on('send message', (data)=>{
       io.sockets.emit('new message', {msg: data, user:  socket.username })

   });
   // Disconnect
   socket.on('disconnect',(data)=>{
       if(!socket.username){
           return;
       }

       //delete the user from username array
       usernames.splice(usernames.indexOf(socket.username), 1);
       updateUsernames();
   })
})