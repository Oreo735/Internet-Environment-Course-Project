const mongoose = require("mongoose");
const Post = require("../models/post");
const User = require("../models/user");
const { posts } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/skylikeDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDB = async () => {
  await Post.deleteMany({});
  await User.deleteMany({});
  for (let index = 0; index < 50; index++) {
    const user = new User({
      email: `${posts[index].author}${index}@gmail.com`,
      username: `${posts[index].author}`,
    });
    await user.save();
    const p = new Post({
      body: `${posts[index].body}`,
      username: posts[index].author,
      likes: 0,
    });
    await p.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
