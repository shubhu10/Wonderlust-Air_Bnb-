const express=require("express");
const router=express.Router();

const WrapAsync = require("../utils/WrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController= require("../controllers/user.js");

//signup page render and signup user
router.route("/signup")
.get(userController.rendorSignUpForm)
.post(WrapAsync(userController.signUp));

//Login page render and login user
router.route("/login")
.get(userController.rendorLoginForm)
.post(saveRedirectUrl
    ,passport.authenticate("local",{failureRedirect:'/login', failureFlash:true})
    ,userController.login);

 //logout user   
router.get("/logout",userController.logout);

module.exports=router;