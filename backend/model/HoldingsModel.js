const { model } = require("mongoose");

const { HoldingsSchema } = require("../schemas/HoldingSchema");

const HoldingsModel = model("holding", HoldingsSchema);

module.exports = { HoldingsModel };
