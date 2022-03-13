const Post = require("../models/post");
const User = require("../models/user");

module.exports.showProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("posts");
  res.render("profiles/show", { user });
};

module.exports.renderEdit = async (req, res) => {
  const { id } = req.params;
  const user = await await User.findById(id);

  res.render("profiles/edit", { user });
};

module.exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  const { username, image, bio } = req.body;
  const { path, filename } = req.file;
  const user = await User.findById(id);
  user.username = username;
  user.bio = bio;
  const posts = await Post.find({ _id: { $in: user.posts } });
  await Post.updateMany(
    { username: user.username },
    { $set: { username: username } }
  );
  user.image.url = path;
  user.image.filename = filename;
  await user.save();
  res.redirect(`/profile/${id}`);
};

module.exports.createPost = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  const post = new Post({
    body: req.body.post.body,
    author: user._id,
    likes: 0,
    username: user.username,
  });
  user.posts.push(post._id);
  await user.save();
  await post.save();
  res.redirect(`/profile/${id}`);
};

module.exports.deletePost = async (req, res) => {
  const { id, postId } = req.params;
  await User.findByIdAndUpdate(id, { $pull: { posts: postId } });
  await Post.findByIdAndDelete(postId);

  res.redirect(`/profile/${id}`);
};
