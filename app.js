require("dotenv").config();

const express = require("express");
const path = require('path')

const userRoute = require('./routes/user')
const blogRoute = require("./routes/blog");
const adminRoutes = require("./routes/admin");

const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const Blog = require("./model/blog");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");



const app = express();
const PORT = process.env.PORT;// here we are choosing our own port but, when we are hosting somewhere that port me not be available

// //^connecting mongodb
// mongoose.connect("mongodb://127.0.0.1:27017/blogify").then( _ => console.log('MongoDb Connected')
// )

mongoose.connect(process.env.MONGO_URL).
then((e)=> console.log("Db connected"))

//^ Middlewares
app.set('view engine', 'ejs');
app.set('views',path.resolve('./views'));

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));


app.use('/user', userRoute);
app.use('/blog', blogRoute);
app.use("/admin", adminRoutes);


app.get('/',async(req,res)=>{
    console.log(req.user);
    
    const allBlogs = await Blog.find().populate('createdBy').sort({createdAt: -1});
    return res.render('home', {
        user: req.user,
        blogs: allBlogs,
    });
})

app.use((err, req, res, next) => {
  console.error("🔥 ERROR NAME:", err.name);
  console.error("🔥 ERROR MESSAGE:", err.message);
  console.error("🔥 FULL ERROR:", err);

  return res.status(500).send(err.message || "Upload failed");
});


app.listen(PORT, ()=>{
    console.log(`Server started at PORT: ${PORT}`);
})