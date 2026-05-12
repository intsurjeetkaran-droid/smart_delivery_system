require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const routeRoutes = require("./routes/routeRoutes");

const app = express();



/*
|--------------------------------------------------------------------------
| MIDDLEWARES
|--------------------------------------------------------------------------
*/

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());



/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Route Optimization Service Running",
  });
});



/*
|--------------------------------------------------------------------------
| ROUTES
|--------------------------------------------------------------------------
*/

app.use("/api/routes", routeRoutes);



/*
|--------------------------------------------------------------------------
| 404 HANDLER
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});



/*
|--------------------------------------------------------------------------
| START SERVER
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log("=======================================");
  console.log(`🗺️  Route Optimization Service On Port ${PORT}`);
  console.log("=======================================");
});
