module.exports.isLoggedIn=(req,res,next)=>{
//    console.log(req.path ,"....." ,req.originalUrl);
    
    if(!req.isAuthenticated())
        {
            req.session.redirectUrl=req.originalUrl;
            // console.log(req.session.redirectUrl);
            req.flash("error","You must be loged in to create listing!");
            return res.redirect("/login");
        }
        next();

}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
       try { 
        res.locals.redirectUrl=req.session.redirectUrl;
        
       } catch (error) {
          console.log(error);
       }
       
        // console.log(req.locals.redirectUrl);
    }
    next();
}