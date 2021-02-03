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
  client.on("create-room", (data) => {
    client.join(data.room.id);
    io.to(data.room.id).emit("new-message", {
      message: `room ${data.room.id} created successfully`,
    });
  });

  client.on("join-room", (data) => {
    if (data.room.id) {
      client.join(data.room.id);
      io.to(data.room.id).emit("new-message", {
        message: `user ${data.user} connected`,
      });
    }
  });

  client.on("send-message", (data) => {
    if (data.room.id) {
      io.to(data.room.id).emit("new-message", data);
    }
  });

  client.on("disconnect", () => {
    io.to(data.room.id).emit("new-message", `user ${client.id} disconnected`);
  });
});

server.listen(process.env.PORT || 3000);
