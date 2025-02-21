// WS Server Setup
import { Server } from "socket.io";

const io = new Server(4001, {
  cors: {
    origin: "*",
  },
  pingTimeout: 40000000,
});

io.on("connection", (socket) => {
  console.log(`New connection`);

  // handle room-join
  socket.on("join-room", async (message) => {
    console.log(
      `${socket.id} joined collab ${message.collabId} with username ${message.user}`
    );
    socket.join(message.collabId);
    // broadcast new user joining
    socket.broadcast.to(message.collabId).emit("user-joined", message.user);

    // make a fetch request to update in the db
    try {
      await fetch("http://localhost:4000/collab/activeHook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activeUser: message.user,
          collabId: message.collabId,
        }),
      });
    } catch (e) {
      console.log("crashed 32");
      console.log(e);
    }

    socket.on("send-code-change", (codeChange) => {
      socket.broadcast
        .to(message.collabId)
        .emit("receive-code-change", codeChange);
      console.log(`${codeChange.user} wrote: ${codeChange.code}`);
    });

    socket.on("send-left-room", async (userLeft) => {
      console.log(`${userLeft} left the room`);

      socket.broadcast.to(message.collabId).emit("receive-left-room", userLeft);

      // fetch to update in db
      try {
        await fetch("http://localhost:4000/collab/leftHook", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userLeft: userLeft,
            collabId: message.collabId,
          }),
        });
      } catch (e) {
        console.log("crashed 62");
        console.log(e);
      }
    });

    socket.on("lang-change", async (changedLang, changedByUser) => {
      console.log(`${changedByUser} changed language to ${changedLang}`);

      socket.broadcast
        .to(message.collabId)
        .emit("lang-change", changedLang, changedByUser);
    });
  });
});
