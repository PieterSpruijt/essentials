// We grab Schema and model from mongoose library.
const { Schema, model } = require("mongoose");

// We declare new schema.
const logchannelSchema = new Schema({
  gid: { type: String },
  logchannel: { type: String, default: "None" }
});

// We export it as a mongoose model.
module.exports = model("logchannels", logchannelSchema);