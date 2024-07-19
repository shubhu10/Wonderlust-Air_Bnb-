const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Listing=require("./listing");

const find=async ()=>{
  let data = await Listing.find({});
  console.log(data);
}

find();