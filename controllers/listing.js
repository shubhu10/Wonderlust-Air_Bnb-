const { response } = require("express");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const map_Token=process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken: map_Token });





// Index Route
module.exports.index=async (req,res)=>{

    const allListing=await Listing.find({});
    
    res.render("./listings/index.ejs",{allListing});
};

//New Post
module.exports.renderNewForm= (req,res)=>{
        console.log(req);  

        res.render("./listings/new.ejs");
       
    
};
//render category
module.exports.category=async(req,res)=>{
    console.log(req.body);
    let category=req.body.category;
    if(!req.body.category)
    {
        req.flash("error","plaease select category");
        res.send("not daata");

    }
    let listing=await Listing.find({country:category});
    console.log(listing);
}

//Show listings
module.exports.showListing=async (req,res)=>{
   
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    res.locals.listings=listing;
    let cordinates=await geoCodingClient.forwardGeocode({
        query: listing.location,
        limit: 1
      })
        .send();
        if (!cordinates.body.features.length) {
            throw new Error("Geocoding API did not return any results");
        }
        console.log(cordinates.body.features[0].geometry);
        let geometry=cordinates.body.features[0].geometry
 
    listing.geometry=geometry;
    console.log(listing);
    if(!listing)
    {
        req.flash("error","Listings you want to requested Does'nt Exist");
        res.redirect("/listings");
        throw(new ExpressError(400,"DATA NOT FOUND WITH this id"));
    }
    // console.log(listing.geometry.coordinates);
    res.render("./listings/show.ejs",{listing});
   

};

//Create Listings
module.exports.createListing=async(req,res)=>{


  
    try {
        let cordinates=await geoCodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
          })
            .send();
            if (!cordinates.body.features.length) {
                throw new Error("Geocoding API did not return any results");
            }
    
            const geometry = cordinates.body.features[0].geometry;
            console.log("Geometry:", geometry);
            console.log(cordinates.body.features[0].geometry);
        const newListing=new Listing(req.body.listing);
        let {path:url,filename}=req.file;
        // console.log(newListing);
        newListing.owner=req.user._id;
        newListing.image={url,filename};
        newListing.geometry=geometry;
        let savedListing= await newListing.save();
        console.log(savedListing);
       
       
        req.flash("success","New Listing Created!");
        res.redirect("/listings");
        console.log(url ,"..... \n",filename )
        
    } catch (error) {
        res.send(error);
        
    }
  
    
 
};

//edit
module.exports.editFormRender=async (req,res)=>{

    let listing=await Listing.findById(req.params.id);

    if(!listing)
    {
        req.flash("error","Listings you want to requested Does'nt Exist");
        res.redirect("/listings");
        throw new ExpressError(400, "DATA NOT FOUND WITH this id");
    }
    let originalUrl=listing.image.url;
    console.log(originalUrl,".....................,,,,");
    originalUrl=originalUrl.replace("/upload","/upload/w_250/");
    console.log("after=>",originalUrl);
    res.render("listings/edit.ejs",{listing,originalUrl});
};

//update
module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;  
    try {
        console.log(req.file);
        let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing,new:true });
       
        if(req.file )
        {
            let {path:url,filename}=req.file;
            listing.image={url,filename};
            console.log(`url.....:${url}  ,filename......${filename}`);
            await listing.save();
            
        }
       
        req.flash("success","Listing Updated!");
        res.redirect(`/listings/${id}`);
        
    } catch (error) {
        console.log("some error occured while edit listings",error);
        res.send(error.message);
    }


};

//delete
module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    let deletedListings=await Listing.findByIdAndDelete(id);
    console.log(deletedListings);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};