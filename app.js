const express=require("express");
const app= express();
const mongoose=require("mongoose");



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