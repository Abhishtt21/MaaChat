const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes')
const User = require('./models/User');
const Message = require('./models/Message')
const rooms = ["#general","#bump", "#cravings","#milestones","#delivery","#gears"];
const cors = require('cors');
require('dotenv').config();
const path = require('path');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors({origin: 'https://maa-chat-g321-abhishtt21s-projects.vercel.app/'}));

app.use('/users', userRoutes)
require('./connection')

const server = require('http').createServer(app);
const PORT = process.env.PORT || 4000;

//const dirname = path.dirname("");
const buildPath = path.join(__dirname,"../frontend/dist");
app.use(express.static(buildPath));

const io = require('socket.io')(server, {
  cors: {
    origin: process.env.FRONTEND,
    methods: ['GET', 'POST']
  }
})


async function getLastMessagesFromRoom(room){
  let roomMessages = await Message.aggregate([
    {$match: {to: room}},
    {$group: {_id: '$date', messagesByDate: {$push: '$$ROOT'}}}
  ])
  return roomMessages;
}

function sortRoomMessagesByDate(messages){
  return messages.sort(function(a, b){
    let date1 = a._id.split('/');
    let date2 = b._id.split('/');

    date1 = date1[2] + date1[0] + date1[1]
    date2 =  date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1
  })
}

// socket connection

io.on('connection', (socket)=> {

  socket.on('new-user', async ()=> {
    const members = await User.find();
    io.emit('new-user', members)
  })

  socket.on('join-room', async(newRoom, previousRoom)=> {
    socket.join(newRoom);
    socket.leave(previousRoom);
    let roomMessages = await getLastMessagesFromRoom(newRoom);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    socket.emit('room-messages', roomMessages)
  })

  socket.on('message-room', async(room, content, sender, time, date) => {
    const newMessage = await Message.create({content, from: sender, time, date, to: room});
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    // sending message to room
    io.to(room).emit('room-messages', roomMessages);
    socket.broadcast.emit('notifications', room)
  })

  app.delete('/logout', async(req, res)=> {
    try {
      const {_id, newMessages} = req.body;
      const user = await User.findById(_id);
      user.status = "offline";
      user.newMessages = newMessages;
      await user.save();
      const members = await User.find();
      socket.broadcast.emit('new-user', members);
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(400).send()
    }
  })

})


app.get('/rooms', (req, res)=> {
  res.json(rooms)
})

app.get('/*',(req,res) => {
  res.sendFile(path.join(buildPath,"index.html"),(err)=>{
    if(err){
      res.status(500).json({"msg": err});
    }
  })
});

server.listen(PORT, ()=> {
  console.log('listening to port', PORT)
})
