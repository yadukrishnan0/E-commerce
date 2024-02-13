const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const port = process.env.PORT;

const Dbconnection = require("./config/db");
const flash = require("connect-flash");
const session = require("express-session");
const cache = require("nocache");
const adminRouter = require("./routers/adminRouter");

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cache());
app.use(flash());

const userRouter = require("./routers/userRouter");

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(express.json());

app.use("/", userRouter);
app.use("/admin", adminRouter);

Dbconnection()
  .then(() => {
    app.listen(port, () => {
      console.log(`server running ${port}`);
    });
  })
  .catch(() => {
    console.log("error data base connection");
  });
