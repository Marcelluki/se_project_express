const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { errors } = require("celebrate");

const mainRouter = require("./routes/index");
const { errorHandler } = require("./middlewares/error-handler");
const { errorLogger, requestLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to the DB");
  })
  .catch(console.error);
app.use(express.json());
// app.use((req, res, next) => {
//   req.user = {
//     _id: "657dae224a376abea9db5d7c",
//   };
//   next();
// });
app.use(cors());
app.use(requestLogger);
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
app.use("/", mainRouter);

// app.use((err, req, res, next) => {
//   console.error(err);
//   return res.status(500).send({ message: "An error occurred on the server" });
// });
app.use(errorLogger);
app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
