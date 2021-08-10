const { Schema, model } = require("mongoose");
module.exports = model(
  "ReactionRole",
  new Schema({
    Guild: String,
    MessageID: String,
    Reaction: String,
    Channel: String,
    Role: String,
  })
);
