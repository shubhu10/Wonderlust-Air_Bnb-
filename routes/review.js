const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/WrapAsync");
const {listingSchema,reviewSchema}=require("../schema");



const Review=require("../models/review");
const { validateReview, isLoggedIn, isAuthor, isReviewAuthor, setUser } = require("../middleware");

const reviewController=require("../controllers/review.js");


// Review Route
router.post("/",isLoggedIn, validateReview,wrapAsync(reviewController.createReview));

// Destroy review route 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;

