const express = require("express")
const router = express.Router();
const User = require('../model/users.js')


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

router.post('/signup', async(req,res)=>{
    const {fullName, email, password} = req.body;
    await User.create({
        fullName,
        email,
        password,
    });
    return res.redirect("/")
})



module.exports = router;