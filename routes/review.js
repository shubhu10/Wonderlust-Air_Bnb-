const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/WrapAsync");
const {listingSchema,reviewSchema}=require("../schema");
const ExpressError=require("../utils/ExpressError");
const Listing=require("../models/listing");
const Review=require("../models/review");


const validateReview=(req,res,next)=>{
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


// Review Route

router.post("/", validateReview,wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    console.log(listing);
    if(!listing)
    {
        throw new ExpressError(400,"listing not found");
    }
    let newReview=new Review(req.body.review);
    console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("new review save");
    req.flash("success","Review Created!");
    res.redirect(`/listings/${listing._id}`);
}))

// Delete review route 

router.delete("/:reviewId",wrapAsync(async(req,res,next)=>{
   let {id,reviewId}=req.params;
   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("success","Review Deleted!");
   res.redirect(`/listings/${id}`);
}))

module.exports=router;

