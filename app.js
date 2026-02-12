require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const router = require("./routes/user");
const blogRoute = require("./routes/blog");
const Blog = require("./model/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();

//PORT FIX
const PORT = process.env.PORT || 3000;

// ---------- Database ----------
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(" MongoDB connection error:", err));

// ---------- View Engine ----------
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// ---------- Middlewares ----------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

// ---------- Routes ----------
app.get("/", async (req, res) => {
  const allBlogs = await Blog
    .find()
    .populate("createdBy")
    .sort({ createdAt: -1 });

  return res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", router);
app.use("/blog", blogRoute);

// ---------- Server ----------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
