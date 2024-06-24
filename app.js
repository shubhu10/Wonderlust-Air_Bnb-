const express=require("express");
const app= express();
const mongoose=require("mongoose");
const Listing=require("./models/listing");
const { assert } = require("console");
const path=require("path");
const methodOverride=require("method-override");


app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname, "views"));
app.use(methodOverride("_method"));

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

app.get("/",(req,res)=>{
    res.send("hey ! i am root");
})

// app.get("/testListing",async (req,res)=>{

//     let sampleListing=new Listing({
//         title:"My new villa",
//         description:"by the bich",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India",
//     });


//    await sampleListing.save().then((res)=>{
//     console.log(res);
//    }).catch((err)=>{
//     console.log(err);
//    });

// })

// index route 

app.get("/listings",async (req,res)=>{
    const allListing=await Listing.find({});
    // console.log(allListing);
    res.render("./listings/index.ejs",{allListing});
})


// create route 

app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
    
})



//show route

app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});

})

//create post
app.post("/listings" ,async (req,res)=>{
    
    let newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})

//edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
})

//update route 
app.put("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    
    await Listing.findByIdAndUpdate(id,{...req.body.listing ,new:true});
    res.redirect(`/listings/${id}`);

})

//delete route
app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    let deletedListings=await Listing.findByIdAndDelete(id);
    console.log(deletedListings);
    res.redirect("/listings");
})


