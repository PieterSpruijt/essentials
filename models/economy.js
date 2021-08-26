// We grab Schema and model from mongoose library.
const { Schema, model } = require("mongoose");

// We declare new schema.
const economy = new Schema({
  gid: { type: String },
  userid: { type: String },
  bank: { type: Number, default: 0 },
  hand: { type: Number, default: 0 }
});

// We export it as a mongoose model.
module.exports = model("canery_economy", economy);