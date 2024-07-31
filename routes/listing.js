const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/WrapAsync");
const {listingSchema,reviewSchema}=require("../schema");
const ExpressError=require("../utils/ExpressError");
const Listing=require("../models/listing");
const {isLoggedIn, isOwner, validateListing}= require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({storage})

//Index & Create listing Route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn ,upload.single('listing[image]') ,validateListing,wrapAsync(listingController.createListing));

// .post(isLoggedIn ,validateListing,wrapAsync(listingController.createListing));

// create route 
router.get("/new",isLoggedIn,listingController.renderNewForm);

//Create Update Show Route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,listingController.deleteListing );


// index route 
// router.get("/",wrapAsync(listingController.index))


//show route
// router.get("/:id",wrapAsync(listingController.showListing));

//create post
// router.post("/" ,isLoggedIn ,validateListing,wrapAsync(listingController.createListing))

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editFormRender))

//update route 
// router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing))

//delete route
// router.delete("/:id",isLoggedIn,isOwner,listingController.deleteListing );


module.exports=router;