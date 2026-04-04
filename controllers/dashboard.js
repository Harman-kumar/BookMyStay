const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.renderDashboard = async (req,res)=>{

    const listings = await Listing.find({
        owner:req.user._id
    }).populate("reviews");

    const bookings = await Booking.find({
        owner:req.user._id
    }).populate("listing");

    let totalReviews = 0;

    listings.forEach(listing=>{
        totalReviews += listing.reviews.length;
    });

    res.render("users/dashboard",{
        listings,
        totalReviews,
        bookings
    });

};