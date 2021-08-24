// We grab Schema and model from mongoose library.
const { Schema, model } = require("mongoose");

// We declare new schema.
const joinrole = new Schema({
    gid: { type: String },
    Role: { type: String }
});

// We export it as a mongoose model.
module.exports = model("joinrole", joinrole);