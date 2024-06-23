const mongoose=require("mongoose");
const initData =require("./data.js");
const Listing=require("../models/listing.js");

let mongooseUrl="mongodb://127.0.0.1:27017/wanderlust"

async function main(){
    await mongoose.connect(mongooseUrl);
}

main().then((res)=>{
    console.log("connect successfull");
}).catch((err)=>{
    console.log(err);
});


const initDB=async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data).then((res)=>{
        console.log(res);
    }).catch((err)=>{
        console.log(err);
    });
    console.log("data was  initialized ");

}

initDB();


