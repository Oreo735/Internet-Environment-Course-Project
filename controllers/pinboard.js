const Post = require("../models/post");
const User = require("../models/user");

module.exports.index = async (req, res, next) => {
  const posts = await Post.find({}).populate("author");
  const user = await User.findById(req.user._id);
  res.render("pinboard/index", { posts, user });
};

module.exports.createPost = async (req, res) => {
  const user = await User.findById(req.user._id);
  const post = new Post({
    body: req.body.post.body,
    author: user._id,
    likes: 0,
    username: user.username,
  });
  user.posts.push(post._id);
  await user.save();
  await post.save();
  res.redirect("/pinboard");
};

module.exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  await User.findByIdAndUpdate(userId, { $pull: { posts: id } });
  await Post.findByIdAndDelete(id);
  res.redirect("/pinboard");
};
