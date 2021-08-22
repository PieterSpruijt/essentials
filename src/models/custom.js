const { Schema, model } = require("mongoose");
module.exports = model(
  "custom",
  new Schema({
    Guild: String,
    Command: String,
    Content: String,
  })
);
