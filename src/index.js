const app = require("express")();
const cors = require("cors");
app.use(cors());

const server = require("http").createServer(app);
const io = require("socket.io")(server);
require("dotenv/config");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/templates/index.html");
});

io.on("connection", (client) => {

  client.on("join-room", ({ roomId, name}) => {
    if (roomId) {
      client.join(roomId);
      io.to(roomId).emit("new-user", {
        message: `new user ${name} connected!`,
      });
    }
  });

  client.on("send-message", ({ roomId, name, message}) => {
    if (roomId) {
      io.to(roomId).emit("new-message", {
        message,
        name,
      });
    }
  });

  client.on("disconnecting", function () {
    let rooms = Object.keys(client.rooms);
    rooms.forEach( room => client.to(room).emit("connection left", ` ${client.id} + " has left`));
  });
  
});

server.listen(process.env.PORT || 3000);
