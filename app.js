if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const passport = require("passport");
const passportLocal = require("passport-local");

const { postSchema } = require("./schemas.js");

const mongoSanitize = require("express-mongo-sanitize");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");

const User = require("./models/user");
const Post = require("./models/post");

const pinboardRoutes = require("./routes/pinboard");
const userRoutes = require("./routes/users");
const profileRoutes = require("./routes/profiles");
const adminRoutes = require("./routes/admin");

const MongoDBStore = require("connect-mongo");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/skylikeDB";

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

const secret = process.env.SECRET || "keyboard cat";

const store = MongoDBStore.create({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoutes);
app.use("/pinboard", pinboardRoutes);
app.use("/profile", profileRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.redirect("login");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Wrong!";
  console.log(err);
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log(`Serving on port 3000..`);
});
