const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {
  isLoggedIn,
  isAuthor,
  validatePost,
  paginatedResult,
} = require("../middleware");
const Post = require("../models/post");
const { postSchema } = require("../schemas.js");

const pinboard = require("../controllers/pinboard");

router
  .route("/")
  .get(isLoggedIn, paginatedResult(Post), catchAsync(pinboard.index))
  .post(isLoggedIn, validatePost, catchAsync(pinboard.createPost));

router
  .route("/:id")
  .delete(isLoggedIn, isAuthor, catchAsync(pinboard.deletePost));

module.exports = router;
