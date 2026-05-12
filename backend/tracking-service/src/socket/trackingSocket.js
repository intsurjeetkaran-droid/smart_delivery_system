module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Driver Connected:", socket.id);



    socket.on("send-location", async (data) => {
      console.log("Location Received:", data);



      io.emit("receive-location", data);
    });



    socket.on("disconnect", () => {
      console.log("Driver Disconnected:", socket.id);
    });
  });
};