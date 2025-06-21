require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const bcrypt = require("bcrypt");
const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");

const app = express();
const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

// ✅ Validate Mongo URI
if (!uri || !uri.startsWith("mongodb")) {
  console.error("❌ Invalid or missing MONGO_URL");
  process.exit(1);
}

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve frontend build (React app)
app.use("/", express.static(path.join(__dirname, "..", "frontend", "build")));

// ✅ Serve dashboard build
app.use("/dashboard", express.static(path.join(__dirname, "..", "dashboard", "build")));

// ✅ Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Holdings Routes
app.get("/allHoldings", async (req, res) => {
  try {
    const data = await HoldingsModel.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching holdings", error: err });
  }
});

app.post("/updateHoldingsNetDay", async (req, res) => {
  try {
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

// ✅ Positions Route
app.get("/allPositions", async (req, res) => {
  try {
    const data = await PositionsModel.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching positions", error: err });
  }
});

// ✅ Orders Route
app.post("/newOrder", async (req, res) => {
  try {
    const newOrder = new OrdersModel(req.body);
    await newOrder.save();

    if (newOrder.mode && newOrder.mode.toLowerCase() === "buy") {
      let holding = await HoldingsModel.findOne({ name: newOrder.name });

      if (holding) {
        const totalQty = holding.qty + newOrder.qty;
        const totalCost = holding.avg * holding.qty + newOrder.price * newOrder.qty;
        const newAvg = totalCost / totalQty;

        const netChange = (newOrder.price - newAvg) * totalQty;
        const dayChange = newOrder.price - holding.price;

        holding.qty = totalQty;
        holding.avg = newAvg;
        holding.price = newOrder.price;
        holding.net = netChange.toFixed(2);
        holding.day = dayChange.toFixed(2);

        await holding.save();
      } else {
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

// ✅ Dashboard fallback route (SPA)
app.get("/dashboard*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dashboard", "build", "index.html"));
});

// ✅ Frontend fallback route (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
});

// ✅ Connect to MongoDB and start server
mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed", err);
  });
