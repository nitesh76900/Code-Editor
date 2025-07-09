const mongoose = require("mongoose");

const versionSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  snapshot: { type: String, required: true },
  savedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  savedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Version", versionSchema);
