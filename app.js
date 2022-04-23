
const createError = require("http-errors"); // to handle the server errors
const express = require("express");
const path = require("path"); // to refer to local paths
const cookieParser = require("cookie-parser"); // to handle cookies
const session = require("express-session"); // to handle sessions using cookies
const debug = require("debug")("personalapp:server");
const layouts = require("express-ejs-layouts");
const axios = require("axios");

const Student = require("./models/Student");

const students = require("./public/data/StudentJson.json");

const mongoose = require("mongoose");
const mongodb_URI = "mongodb+srv://cz:cz001001@cluster0.nkstg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(mongodb_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("we are connected!!!");
});

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: "zzbbyanana789sdfa8f9ds8f90ds87f8d9s789fds", // this ought to be hidden in process.env.SECRET
        resave: false,
        saveUninitialized: false,
    })
);

const auth = require("./routes/auth");
const { deflateSync } = require("zlib");
app.use(auth);

const isLoggedIn = (req, res, next) => {
    if (res.locals.loggedIn) {
        next();
    } else res.redirect("/login");
};

app.get("/", (req, res, next) => {
    res.render("index");
});

app.get("/about", (req, res, next) => {
    res.render("about");
});

app.get("/upsertDB", async (req, res, next) => {
    for (student of students) {
      const {ID} = student;
      await Student.findOneAndUpdate(
        {ID:ID},
        student,
        { upsert: true }
      );
    }
    const num = await Student.find({}).count();
    res.send("data uploaded: " + num);
  });


  app.post(
    "/students/byMajor",
    async (req, res, next) => {
      const { major } = req.body;
      const students = await Student.find({
        Major: major,
      }).sort({ ID:1 });
  
      res.locals.students = students;
      
      res.render("studentlist");
    }
  );
  
  app.post(
    "/students/byAge",
    async (req, res, next) => {
      const { min_age,max_age } = req.body;
      const students = await Student.find({
        Age:{$gt:min_age, $lt:max_age}
      }).sort({ ID:1 });
  
      res.locals.students = students;
      
      res.render("studentlist");
    }
  ); 


  app.post(
    "/students/bySAT",
    async (req, res, next) => {
      const { min_SAT,max_SAT } = req.body;
      const students = await Student.find({
        SAT:{$gt:min_SAT, $lt:max_SAT}
      }).sort({ ID:1 });
  
      res.locals.students = students;
      
      res.render("studentlist");
    }
  ); 



  app.use(function (req, res, next) {
    next(createError(404));
  });
  

  app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.render("error");
  });

const port = process.env.PORT || 5000;
app.set("port", port);


const http = require("http");
const server = http.createServer(app);

server.listen(port);

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

server.on("error", onError);

server.on("listening", onListening);

module.exports = app;