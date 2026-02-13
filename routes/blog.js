const { Router } = require("express");
const multer = require("multer");
// const path = require("path");

const router = Router();
const User = require("../model/users");
const Blog = require("../model/blog");
const Comment = require("../model/comment");

/* Multer Storage Configuration */
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blogs",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });


/* Add New Blog Page */
router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
	user: req.user,
  });
});

/* Blog Detail Page */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id).populate("createdBy");
  const comments = await Comment.find({ blogId: id }).populate("createdBy");
  return res.render("blog", {
	user: req.user,
	blog : blog,
  comments: comments,
  });
});

/* Add Comment */
router.post("/comment/:blogId", async (req, res) => {
  if (!req.user) {
    return res.status(401).send("Login required");
  }

  await Comment.create({
	content: req.body.content,
	blogId: req.params.blogId,
	createdBy: req.user.id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

/* Create Blog */
router.post("/", upload.single("coverImage"), async (req, res) => {
  try {
    const { title, body } = req.body;

    if (!req.file) {
      return res.status(400).send("Image upload failed");
    }

    const blog = await Blog.create({
      title,
      body,
      createdBy: req.user.id,
      coverImageURL: req.file.path, // Cloudinary URL
    });

    return res.redirect(`/blog/${blog._id}`);
  } catch (err) {
    console.error("BLOG CREATE ERROR:", err);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;