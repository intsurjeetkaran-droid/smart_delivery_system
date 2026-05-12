require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const http = require("http");

const { Server } = require("socket.io");

const connectDB = require("./config/db");

const trackingRoutes = require("./routes/trackingRoutes");

const trackingSocket = require("./socket/trackingSocket");

const app = express();



connectDB();



app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());



app.use("/api/tracking", trackingRoutes);



const server = http.createServer(app);



const io = new Server(server, {
  cors: {
    origin: "*",
  },
});



trackingSocket(io);



const PORT = process.env.PORT || 5003;

server.listen(PORT, () => {
  console.log(`Tracking Service Running On Port ${PORT}`);
});