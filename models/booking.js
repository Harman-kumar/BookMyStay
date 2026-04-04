const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({

    listing:{
        type: Schema.Types.ObjectId,
        ref:"Listing"
    },

    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },

    name:String,

    phone:String,

    message:String,

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model("Booking",bookingSchema);