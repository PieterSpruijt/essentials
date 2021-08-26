const { Schema, model } = require("mongoose");
module.exports = model(
  "canary_ReactionRole",
  new Schema({
    Guild: String,
    MessageID: String,
    Reaction: String,
    Channel: String,
    Role: String,
  })
);
