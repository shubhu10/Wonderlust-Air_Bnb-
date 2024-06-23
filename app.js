const express=require("express");
const app= express();
const mongoose=require("mongoose");
const Listing=require("../Wonderlust-Air_Bnb-/modles/listing");
const { assert } = require("console");



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

app.get("/testListing",async (req,res)=>{

    let sampleListing=new Listing({
        title:"My new villa",
        description:"by the bich",
        price:1200,
        location:"Calangute,Goa",
        country:"India",
    });


   await sampleListing.save().then((res)=>{
    console.log(res);
   }).catch((err)=>{
    console.log(err);
   });

})