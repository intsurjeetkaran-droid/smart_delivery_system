require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const notificationRoutes = require("./routes/notificationRoutes");

const app = express();



app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());



app.use("/api/notifications", notificationRoutes);



const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
  console.log(`Notification Service Running On Port ${PORT}`);
});