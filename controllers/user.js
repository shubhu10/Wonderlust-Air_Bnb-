const User=require("../models/user.js");

//Signup Form
module.exports.rendorSignUpForm=(req,res)=>{
    res.render("user/signup.ejs");
};

//Signup
module.exports.signUp=async(req,res)=>{
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


};

//Login Form
module.exports.rendorLoginForm=(req,res)=>{
    res.render("user/login.ejs");
};
//login
module.exports.login=async(req,res)=>{
    console.log(res.locals.redirectUrl);
    req.flash("success","Welcome Back On wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl;
    console.log(redirectUrl,".....");
    res.redirect(redirectUrl);

};
//logout
module.exports.logout=(req,res,next)=>{
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
}