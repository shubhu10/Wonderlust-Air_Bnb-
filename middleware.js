const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn=(req,res,next)=>{
//    console.log(req.path ,"....." ,req.originalUrl);

    
    if(!req.isAuthenticated())
        {
            req.session.redirectUrl=req.originalUrl;
            // console.log(req.session.redirectUrl);
            req.flash("error","You must be loged in to create listing!");
            return res.redirect("/login");
        }
        console.log(req.user._id);
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
module.exports.setUser = (req, res, next) => {
    if (req.user) {
        res.locals.currUser = req.user;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);

    if(!listing.owner._id.equals(res.locals.currUser._id))
    {
        req.flash("error","you are not owner of this listing!");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);

if(error){
   let errMsg=error.details.map((el)=>el.message).join(",");
   console.log(`this is a validate listing error ${errMsg}`);
   throw new ExpressError(400,errMsg);
   
}
else
{
   next();
}
}


module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);

if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    console.log(`this is a validate review error ${errMsg}`);
    throw new ExpressError(400,errMsg);
}
else
{
    next();
}
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    console.log(res.locals.currUser);
    console.log(review.author._id);

    if(!review.author._id.equals(res.locals.currUser._id))
    {
        req.flash("error","you are not author of this review!");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

