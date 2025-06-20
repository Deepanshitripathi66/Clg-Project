require("dotenv").config();
const mongoose = require("mongoose");
const { HoldingsModel } = require("../model/HoldingsModel");

const uri = process.env.MONGO_URL;

async function addSampleHoldings() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");

    const sampleHoldings = [
      { name: "AAPL", qty: 10, avg: 150, price: 155, net: "+50", day: "+2" },
      { name: "GOOGL", qty: 5, avg: 1000, price: 1020, net: "+100", day: "+1" },
      { name: "TSLA", qty: 8, avg: 600, price: 610, net: "+80", day: "-3" },
      { name: "MSFT", qty: 12, avg: 300, price: 305, net: "+60", day: "+1" },
      { name: "AMZN", qty: 7, avg: 3300, price: 3320, net: "+140", day: "+1" },
      { name: "QUICKHEAL", qty: 2, avg: 0, price: 0, net: "0", day: "0" },
      { name: "RELIANCE", qty: 1, avg: 98888, price: 98888, net: "+0", day: "+0" },
      { name: "WIPRO", qty: 1, avg: 140.67, price: 140.67, net: "+0", day: "+0" },
      { name: "ONGC", qty: 1, avg: 0, price: 0, net: "0", day: "0" },
      { name: "HUL", qty: 1, avg: 4.55, price: 4.55, net: "+0", day: "+0" },
    ];

    await HoldingsModel.deleteMany({});
    const inserted = await HoldingsModel.insertMany(sampleHoldings);
    console.log(`Inserted ${inserted.length} sample holdings`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Error adding sample holdings:", err);
  }
}

addSampleHoldings();
