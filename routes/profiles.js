const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validatePost } = require("../middleware");
const User = require("../models/user");
const profiles = require("../controllers/profiles");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/:id")
  .get(isLoggedIn, catchAsync(profiles.showProfile))
  .post(isLoggedIn, validatePost, profiles.createPost)
  .put(isLoggedIn, upload.single("image"), catchAsync(profiles.updateProfile));

router.get("/:id/edit", isLoggedIn, catchAsync(profiles.renderEdit));

router
  .route("/:id/posts/:postId")
  .delete(isLoggedIn, catchAsync(profiles.deletePost));
module.exports = router;
