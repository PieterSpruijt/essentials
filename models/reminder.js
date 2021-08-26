// We grab Schema and model from mongoose library.
const { Schema, model } = require("mongoose");

// We declare new schema.
const reminders = new Schema({
    userid: { type: String },
    text: { type: String },
    channel: { type: String, default: `dm` },
    endtime: { type: Number }
});

// We export it as a mongoose model.
module.exports = model("canery_reminder", reminders);