const { Schema, model, Types } = require("mongoose");

const businessSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: false, default:"general" },
  owner: { type: Types.ObjectId, ref: "User", required: true },
  subscribers: [{ type: Types.ObjectId, ref: "User" }],
  reviews: [
    {
      userId: { type: Types.ObjectId, ref: "User" },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Business = model("Business", businessSchema);
module.exports = Business;