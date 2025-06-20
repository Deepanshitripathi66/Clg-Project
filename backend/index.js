require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

// Mongo URL Validation
function isValidMongoUrl(url) {
  return typeof url === "string" && url.startsWith("mongodb");
}
if (!isValidMongoUrl(uri)) {
  console.error("Invalid MONGO_URL");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve React build files
app.use("/dashboard", express.static(path.resolve(__dirname, "../Dashboard/build")));
app.use("/", express.static(path.resolve(__dirname, "../frontend/build")));

// API Endpoints
app.get("/allHoldings", async (req, res) => {
  try {
    const { HoldingsModel } = require("./model/HoldingsModel");
    const data = await HoldingsModel.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching holdings", error: err });
  }
});

// New endpoint to recalculate and update net and day changes for all holdings
app.post("/updateHoldingsNetDay", async (req, res) => {
  try {
    const { HoldingsModel } = require("./model/HoldingsModel");
    const holdings = await HoldingsModel.find();

    for (const holding of holdings) {
      if (holding.qty === 0 || holding.price === 0) {
        holding.net = "0.00";
        holding.day = "0.00";
      } else {
        const netChange = (holding.price - holding.avg) * holding.qty;
        const dayChange = holding.pricePrev ? holding.price - holding.pricePrev : 0;

        holding.net = netChange.toFixed(2);
        holding.day = dayChange.toFixed(2);
      }

      await holding.save();
    }

    res.status(200).json({ message: "Holdings net and day changes updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating holdings", error: err });
  }
});

app.get("/allPositions", async (req, res) => {
  try {
    const { PositionsModel } = require("./model/PositionsModel");
    const data = await PositionsModel.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching positions", error: err });
  }
});

app.post("/newOrder", async (req, res) => {
  try {
    const { OrdersModel } = require("./model/OrdersModel");
    const { HoldingsModel } = require("./model/HoldingsModel");

    const newOrder = new OrdersModel(req.body);
    await newOrder.save();

    if (newOrder.mode && newOrder.mode.toLowerCase() === "buy") {
      let holding = await HoldingsModel.findOne({ name: newOrder.name });

      if (holding) {
        const totalQty = holding.qty + newOrder.qty;
        const totalCost = holding.avg * holding.qty + newOrder.price * newOrder.qty;
        const newAvg = totalCost / totalQty;

        // Calculate net change and day change
        const netChange = (newOrder.price - newAvg) * totalQty;
        // For day change, assuming previous price is holding.price
        const dayChange = newOrder.price - holding.price;

        holding.qty = totalQty;
        holding.avg = newAvg;
        holding.price = newOrder.price;
        holding.net = netChange.toFixed(2);
        holding.day = dayChange.toFixed(2);

        await holding.save();
      } else {
        // For new holding, set net and day change to 0
        holding = new HoldingsModel({
          name: newOrder.name,
          qty: newOrder.qty,
          avg: newOrder.price,
          price: newOrder.price,
          net: "0.00",
          day: "0.00",
        });
        await holding.save();
      }
    }

    res.status(201).json({ message: "Order placed", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: "Order failed", error: err });
  }
});

// Frontend wildcard route
app.get("*", (req, res) => {
  if (req.originalUrl.startsWith("/dashboard")) {
    res.sendFile(path.resolve(__dirname, "../Dashboard/build/index.html"));
  } else {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  }
});

// MongoDB connection + Server start
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed", err);
  });
