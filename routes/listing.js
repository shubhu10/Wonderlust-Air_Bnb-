const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/WrapAsync");
const {listingSchema,reviewSchema}=require("../schema");
const ExpressError=require("../utils/ExpressError");
const Listing=require("../models/listing");
const {isLoggedIn}= require("../middleware.js");



const validateListing=(req,res,next)=>{
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

// index route 
router.get("/",wrapAsync(async (req,res)=>{
    const allListing=await Listing.find({});
    
    res.render("./listings/index.ejs",{allListing});
}))


// create route 

router.get("/new",isLoggedIn,(req,res)=>{
    console.log(req.user);
    
    res.render("./listings/new.ejs");
    
})



//show route

router.get("/:id",wrapAsync(async (req,res)=>{

        let {id}=req.params;
        const listing=await Listing.findById(id).populate("reviews");
        if(!listing)
        {
            req.flash("error","Listings you want to requested Does'nt Exist");
            res.redirect("/listings");
            throw(new ExpressError(400,"DATA NOT FOUND WITH this id"));
        }
        res.render("./listings/show.ejs",{listing});

}))

//create post
router.post("/" ,validateListing,wrapAsync(async(req,res)=>{

    const newListing=new Listing(req.body.listing);
    console.log(newListing);
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}))

//edit route
router.get("/:id/edit",isLoggedIn, wrapAsync(async (req,res)=>{
    console.log("working");
    // console.log(req.params.id);
    let listing=await Listing.findById(req.params.id);
    console.log(listing);
    if(!listing)
    {
        req.flash("error","Listings you want to requested Does'nt Exist");
        res.redirect("/listings");
        throw new ExpressError(400, "DATA NOT FOUND WITH this id");
    }
   
    res.render("listings/edit.ejs",{listing});
}))

//update route 
router.put("/:id",isLoggedIn, validateListing, wrapAsync(async (req,res)=>{
    let {id}=req.params;

    
    await Listing.findByIdAndUpdate(id,{...req.body.listing ,new:true});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);

}))

//delete route
router.delete("/:id",isLoggedIn, async (req,res)=>{
    let {id}=req.params;
    let deletedListings=await Listing.findByIdAndDelete(id);
    console.log(deletedListings);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
})


module.exports=router;