const mongoose=require("mongoose");
const { type } = require("os");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
        title:{
            type:String,
            require:true,

              },
            description:String,
            image:{
                type: String,
                default:"https://images.pexels.com/photos/221387/pexels-photo-221387.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                set :(v)=> v ==="" ?"https://images.pexels.com/photos/221387/pexels-photo-221387.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" :v,
            },
            price:Number,
            location:String,
            country:String,
            reviews:[{
              type:Schema.Types.ObjectId,
              ref:"Review",
            }],

});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;

