const { date } = require("joi");
const { Module } = require("module");
const mongoose=require("mongoose");
const { type } = require("os");
const Schema=mongoose.Schema;

const reviewSchema=new Schema({
    comment:String,
   rang:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    }
});

module.exports=mongoose.model("Review",reviewSchema);