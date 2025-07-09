const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  language: { type: String, required: true },
  content: { type: String, default: "" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  lastEditedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lastEditedAt: { type: Date },
  versions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Version" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

projectSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Project", projectSchema);
