const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
})

router.post("/signup",WrapAsync(async(req,res)=>{
    try { 
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        let registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcom to WanderLust");
            res.redirect("/listings"); 
        })
       
        
    } catch (er) {
        req.flash("error",er.message);
        res.redirect("/signup");
        
    }


}))

router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
});

router.post("/login"
    ,saveRedirectUrl
    ,passport.authenticate("local",{failureRedirect:'/login', failureFlash:true})
    ,async(req,res)=>{
        console.log(res.locals.redirectUrl);
        req.flash("success","Welcome Back On wanderlust!");
        let redirectUrl=res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);

})

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err)
        {
           return next(err);
        }
        else
        {
            req.flash("success","You are logged out!");
            res.redirect("/listings");
        }
    });
});

module.exports=router;