
 const Listing=require("../models/listing");
const fetch = require("node-fetch");
module.exports.index=async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm=(req, res) => {
 res.render("listings/new.ejs");
};


module.exports.showListing=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path: "reviews",populate:{path:"author",}}).populate("owner");
  if(!listing){
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings")
  }
  res.render("listings/show.ejs", { listing });
}
module.exports.createListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }

  let url;
  let filename;

  if (req.file) {
    url = req.file.path;
    filename = req.file.filename;
  } else {
    url = "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60";
    filename = "listingimage";
  }

  console.log(url, "  ", filename);

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { filename, url };

  //  (geocoding)
  let location = req.body.listing.location;

  let response = await fetch(
  `https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`,
  {
    headers: {
      "User-Agent": "my-app"   
    }
  }
);
  let data = await response.json();

  if (!data.length) {
    req.flash("error", "Location not found");
    return res.redirect("/listings/new");
  }

  newListing.latitude = data[0].lat;
  newListing.longitude = data[0].lon;

  

  await newListing.save();

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
    if(!listing){
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings")
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  // get old listing (to compare location)
  let oldListing = await Listing.findById(id);

  // (only if location changed)
  let newLocation = req.body.listing.location;

  if (newLocation && newLocation !== oldListing.location) {
    let response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${newLocation}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "my-app"
        }
      }
    );

    let data = await response.json();

    if (data.length) {
      req.body.listing.latitude = parseFloat(data[0].lat);
      req.body.listing.longitude = parseFloat(data[0].lon);
    }
  }
 console.log("DATA GOING TO DB:", req.body.listing);

//ORIGINAL CODE (UNCHANGED)
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { filename, url };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};
module.exports.destroyListing=async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
    req.flash("success","Listing Deleted!");
  res.redirect("/listings");
}

module.exports.searchListings = async (req, res) => {
  let { q } = req.query;

  if (!q) {
    return res.redirect("/listings");
  }

  // 🔥 normalize user input
  let search = q.toLowerCase().replace(/\s+/g, "");

  // 🔥 get all listings first
  let allListings = await Listing.find({});

  // 🔥 filter manually
  let listings = allListings.filter((listing) => {
    let location = listing.location.toLowerCase().replace(/\s+/g, "");
    let country = listing.country.toLowerCase().replace(/\s+/g, "");
    let title = listing.title.toLowerCase().replace(/\s+/g, "");

    return (
      location.includes(search) ||
      country.includes(search) ||
      title.includes(search)
    );
  });

  res.render("listings/index.ejs", { allListings: listings });
};