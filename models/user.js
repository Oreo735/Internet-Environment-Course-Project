const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    url: { type: String, default: "/images/defaultFace.jpg" },
    filename: String,
  },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  bio: String,
});

UserSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Post.deleteMany({
      _id: { $in: doc.posts },
    });
  }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
