// We grab Schema and model from mongoose library.
const { Schema, model } = require("mongoose");

// We declare new schema.
const lvlrewardSchema = new Schema({
    gid: { type: String },
    role: { type: String },
    level: { type: Number }
});

// We export it as a mongoose model.
module.exports = model("lvlreward", lvlrewardSchema);