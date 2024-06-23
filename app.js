const express=require("express");
const app= express();
const mongoose=require("mongoose");

app.listen(1010,()=>{
    console.log("server is listening on port 1010");
})

app.get("/",(req,res)=>{
    res.send("hey ! i am root");
})