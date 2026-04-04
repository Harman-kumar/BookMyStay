const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main(){
await mongoose.connect('mongodb://127.0.0.1:27017/bookmystay');
}
main().then(()=>{
    console.log("connect to db in app.js");
}).catch((err)=>{console.log(err)});


const initDB = async () => {
  await Listing.deleteMany({});
   initData.data=initData.data.map((obj)=>({...obj,owner:"69ad32250ccb82f332a3e192"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();