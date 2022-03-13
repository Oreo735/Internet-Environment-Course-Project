const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  body: String,
  likes: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  username: String,
});

module.exports = mongoose.model("Post", PostSchema);
