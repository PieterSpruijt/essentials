// We grab Schema and model from mongoose library.
const { Schema, model } = require("mongoose");

// We declare new schema.
const afkSchema = new Schema({
    gid: { type: String },
    userid: { type: String },
    message: {type: String, default: false}
});

// We export it as a mongoose model.
module.exports = model("afk", afkSchema);