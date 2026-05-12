const Tracking = require("../models/Tracking");



module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Driver Connected:", socket.id);



    // Expected payload: { orderId, driverId, latitude, longitude, status }
    socket.on("send-location", async (data) => {
      console.log("Location Received:", data);

      try {
        // Persist to DB
        await Tracking.create({
          orderId: data.orderId,
          driverId: data.driverId,
          latitude: data.latitude,
          longitude: data.longitude,
          status: data.status || "moving",
        });
      } catch (err) {
        console.error("Failed to save location to DB:", err.message);
      }

      // Broadcast to all connected clients (frontend map)
      io.emit("receive-location", data);
    });



    socket.on("disconnect", () => {
      console.log("Driver Disconnected:", socket.id);
    });
  });
};
