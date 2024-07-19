const express=require("express");
const app= express();
const mongoose=require("mongoose");
const Listing=require("./models/listing");
const { assert } = require("console");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/WrapAsync");
const ExpressError=require("./utils/ExpressError");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
const Review=require("./models/review");


app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")));

let mongooseUrl="mongodb://127.0.0.1:27017/wanderlust"

async function main(){
    await mongoose.connect(mongooseUrl);
}

main().then((res)=>{
    console.log("connect successfull");
}).catch((err)=>{
    console.log(err);
});

app.listen(1010,()=>{
    console.log("server is listening on port 1010");
})

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    

    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else
    {
        next();
    }
}
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    

    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else
    {
        next();
    }
}

app.get("/",(req,res)=>{
    res.send("hey ! i am root");
})



// index route 

app.get("/listings",wrapAsync(async (req,res)=>{
    const allListing=await Listing.find({});
    
    res.render("./listings/index.ejs",{allListing});
}))


// create route 

app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
    
})



//show route

app.get("/listings/:id",wrapAsync(async (req,res)=>{

        let {id}=req.params;
        const listing=await Listing.findById(id).populate("reviews");
        if(!listing)
        {
            throw(new ExpressError(400,"DATA NOT FOUND WITH this id"));
        }
        res.render("./listings/show.ejs",{listing});

}))

//create post
app.post("/listings" ,validateListing,wrapAsync(async (req,res)=>{

    const newListing=new Listing(req.body.listing);

    await newListing.save();
    res.redirect("/listings");
}))

//edit route
app.get("/listings/:id/edit",validateListing, wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}))

//update route 
app.put("/listings/:id",validateListing, wrapAsync(async (req,res)=>{
    let {id}=req.params;
    
    await Listing.findByIdAndUpdate(id,{...req.body.listing ,new:true});
    res.redirect(`/listings/${id}`);

}))
// Review Route

app.post("/listings/:id/reviews", validateReview,wrapAsync( async(req,res)=>{
     let listing= await Listing.findById(req.params.id);
     let newReview=new Review(req.body.review);
     console.log(newReview);
   

     listing.reviews.push(newReview);

     await newReview.save();
     await listing.save();
     console.log("new review save");
     res.redirect(`/listings/${listing._id}`);
}))


//delete route
app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    let deletedListings=await Listing.findByIdAndDelete(id);
    console.log(deletedListings);
    res.redirect("/listings");
})



app.all("*", (req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("./listings/error.ejs",{message});
})


