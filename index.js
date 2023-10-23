// external imports
const http = require("http");
const express = require("express");
// const socketIo = require("socket.io");
const app = express();
//const server = http.createServer(app);
//const io = require("socket.io")(server);
// global.io = io;
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

//!internal imports
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler");
const loginRouter = require("./routers/loginRouter");
const usersRouter = require("./routers/usersRouter");
const inboxRouter = require("./routers/inboxRouter");

dotenv.config();

//global.io = io; // Assigning the io instance to global

//?db connection
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("mongodb connection error", error);
});
db.once("open", () => {
  console.log("Connected to MongoDB");
});

//? to parse the req properties
app.use(express.json());
//? to parse the form that will be created with ejs
app.use(express.urlencoded({ extended: true }));

// set view engine
app.set("view engine", "ejs");

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// routing setup
app.use(
  "/",

  loginRouter
);
app.use("/users", usersRouter);
app.use("/inbox", inboxRouter);

// 404 not found handler
app.use(notFoundHandler);
// common error handler
app.use(errorHandler);

app.listen(3000 () => {
  console.log(`app listening to port 3000`);
});
