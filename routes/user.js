const express = require("express")
const router = express.Router();
const User = require('../model/users.js')
const upload = require("../middlewares/upload");

// const multer = require("multer");
// const path = require("path");

// /* Multer Storage Configuration */
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.resolve("./public/uploads/"));
//   },
//   filename: function (req, file, cb) {
//     const fileName = `${Date.now()}-${file.originalname}`;
//     cb(null, fileName);
//   },
// });

// const upload = multer({ storage });


router.get('/signin',(req,res)=>{
    return res.render("signin");
});
 
router.get('/signup',(req,res)=>{
    return res.render("signup");
});

router.post('/signin', async (req,res)=>{
    const {email, password} = req.body;
    try{
        const token = await User.matchPasswordAndGenerateToken(email, password);
        // Set token in cookie or session here if needed
        return res.cookie('token', token).redirect("/");
    }catch(error){
        return res.render("signin", {error: "incorrect password"} );
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie("token").redirect("/");
});

router.post(
  "/signup",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { fullName, email, password } = req.body;

      await User.create({
        fullName,
        email,
        password,
        profileImageURL: req.file ? req.file.path : "/images/default.png",
      });

      return res.redirect("/user/signin"); // ✅ IMPORTANT
    } catch (err) {
      // console.error(err);
      return res.status(500).send("Signup failed");
    }
  }
);


module.exports = router;