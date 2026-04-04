const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Razorpay = require("razorpay");

const Booking = require("../models/booking");
const Listing = require("../models/listing");

// Razorpay instance
const razorpay = new Razorpay({
  key_id: "rzp_test_SZ7u4btFEA61V6",
  key_secret: "6O6yHTn9aOUP4oKh0E3bkzF0"
});

// CREATE ORDER
router.post("/create-order", async (req, res) => {
  try {
    console.log("Creating order...");
    const { listingId } = req.body;

    const listing = await Listing.findById(listingId);

    const order = await razorpay.orders.create({
      amount: listing.price * 100,
      currency: "INR",
      receipt: "receipt_" + listingId
    });

    res.json(order);

  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating order");
  }
});

// VERIFY + SAVE
router.post("/verify-payment", async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      listingId,
      name,
      phone,
      message
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", "6O6yHTn9aOUP4oKh0E3bkzF0")
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      const listing = await Listing.findById(listingId);

      const newBooking = new Booking({
        listing: listing._id,
        owner: listing.owner,
        name,
        phone,
        message
      });

      await newBooking.save();

      res.json({ success: true });

    } else {
      res.json({ success: false });
    }

  } catch (err) {
    console.log(err);
    res.status(500).send("Error verifying payment");
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  req.flash("success","Booking removed");
  res.redirect("/dashboard");
});

module.exports = router;