require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("./models/connection");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var organismesRouter = require("./routes/organismes");
var problematiquesRouter = require("./routes/problematiques");

var app = express();

var cors = require("cors");
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/organismes", organismesRouter);
app.use("/problematiques", problematiquesRouter);

module.exports = app;
