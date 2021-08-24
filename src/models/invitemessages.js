// We grab Schema and model from mongoose library.
const { Schema, model } = require("mongoose");

// We declare new schema.
const invitemessages = new Schema({
    gid: { type: String },
    Channel: { type: String },
    Message: { type: String },
    embed: { type: Boolean, default: false }
});

// We export it as a mongoose model.
module.exports = model("invitemessages", invitemessages);