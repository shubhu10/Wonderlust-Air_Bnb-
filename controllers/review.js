const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");

//Create Review
module.exports.createReview=async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    if(!listing)
    {
        throw new ExpressError(400,"listing not found");
    }
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    // console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("new review save");
    req.flash("success","Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

// Delete Review 
module.exports.destroyReview=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
 };