require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");

const orderRoutes = require("./routes/orderRoutes");

const app = express();



connectDB();



app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());



app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Order Service Running",
  });
});



app.use("/api/orders", orderRoutes);



const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Order Service Running On Port ${PORT}`);
});