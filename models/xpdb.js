const mongoose = require("mongoose");
let xpdb = new mongoose.Schema({
  id: { type: String },
  level: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  reqXP: { type: Number, default: 100 }

});
module.exports = mongoose.model("canery_xpdb", xpdb);
