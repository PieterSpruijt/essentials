// We grab Schema and model from mongoose library.
const { Schema, model } = require("mongoose");

// We declare new schema.
const inviteSchema = new Schema({
  gid: { type: String },
  userid: { type: String },
  inviter: { type: String, default: false },
  invites: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  left: { type: Number, default: 0 }

});

// We export it as a mongoose model.
module.exports = model("canery_invites", inviteSchema);