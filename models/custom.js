const { Schema, model } = require("mongoose");
module.exports = model(
  "canery_custom",
  new Schema({
    Guild: String,
    Command: String,
    Content: String,
  })
);
