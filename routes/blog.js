const { Router } = require("express");
// const multer = require("multer");
// const path = require("path");
const upload = require("../middlewares/upload");
require("dotenv").config();
// const { GoogleGenAI } = require("@google/genai");

const router = Router();
const User = require("../model/users");
const Blog = require("../model/blog");
const Comment = require("../model/comment");
const { generateSummary} = require("../services/geminiServices");
const { moderateContent } = require("../services/moderationService");
const { sendRejectionEmail } = require("../services/emailService");

// const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
// console.log("Gemini key: ",process.env.GEMINI_API_KEY)

// /* Multer Storage Configuration */
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
// 	cb(null, path.resolve("./public/uploads/"));
//   },
//   filename: function (req, file, cb) {
// 	const fileName = `${Date.now()}-${file.originalname}`;
// 	cb(null, fileName);
//   },
// });

// const upload = multer({ storage });

/* Add New Blog Page */
router.get("/add-blog", (req, res) => {
  const error = req.query.error;

  let message = null;

  if (error === "rejected") {
    message = "Your blog was rejected due to inappropriate content.";
  }

  res.render("addBlog", { error: message });
});

/* Blog Detail Page */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id).populate("createdBy");

  if (!blog) {
    return res.status(404).send("Blog not found");
  }

  const isOwner = req.user && blog.createdBy && blog.createdBy._id.toString() === req.user.id;

  if (blog.status !== "published" && !isOwner) {
    return res.redirect("/");
  }

  const allComments = await Comment.find({ blogId: id }).populate("createdBy").sort({ createdAt: -1 });

  // Show approved comments to everyone; let a user also see their own
  // comment while it's still pending/rejected moderation.
  const comments = allComments.filter((comment) => {
    if (comment.status === "approved") return true;
    return req.user && comment.createdBy && comment.createdBy._id.toString() === req.user.id;
  });

  const errorCode = req.query.error;
  let error = null;
  if (errorCode === "comment_rejected") {
    error = "Your comment was held back due to inappropriate content.";
  }

  return res.render("blog", {
	user: req.user,
	blog : blog,
  comments: comments,
  error,
  });
});

//edit blog get request
router.get("/edit/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!req.user || blog.createdBy.toString() !== req.user.id)
    return res.redirect("/");

  res.render("edit-blog", { blog, user: req.user });
});


/* Add Comment */
router.post("/comment/:blogId", async (req, res) => {
  if (!req.user) {
    return res.status(401).send("Login required");
  }

  const { content } = req.body;

  //calling moderation service, same pipeline used for blogs
  const { label, confidence, reason, action } = await moderateContent(content);

  if (action === "reject") {
    // Don't save the comment; let the author know inline on the blog page
    return res.redirect(`/blog/${req.params.blogId}?error=comment_rejected`);
  }

  // "published" from the moderation service maps to "approved" for comments
  const status = action === "published" ? "approved" : "pending";

  await Comment.create({
	content,
	blogId: req.params.blogId,
	createdBy: req.user.id,
  authorSnapshot: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      profileImageURL: req.user.profileImageURL,
    },
  status,
  moderation: {
      label,
      confidence,
      reason,
    },
  });

  return res.redirect(`/blog/${req.params.blogId}`);
});


/* Create Blog */
router.post("/create-blog", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  
  //calling moderation service
  const { label, confidence, reason, category, action } = await moderateContent(`Title: ${title}\nBody: ${body}`);
    
  if(action === "reject"){
    //reject + send email
    //  Send Email
    await sendRejectionEmail(req.user.email, reason);

    // Send response for popup
   return res.redirect("/blog/add-blog?error=rejected");
  }
//if action is pending or publish first store in db
  let blog;
  blog = await Blog.create({
	title,
	body,
	createdBy: req.user.id,
	coverImageURL: req.file ? req.file.path : null,
  authorSnapshot: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    },
  status : action,
  moderation: {
        label,        // SAFE / SPAM / HATE etc.
        confidence,   // 0 to 1
        reason,
        category,
    },
   });

  return res.redirect(`/blog/${blog._id}`);
});

//delete blog
router.post("/delete/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.redirect("/");
    }

    // Authorization check
    if (blog.createdBy._id.toString() !== req.user.id) {
      return res.status(403).send("Unauthorized");
    }
    await Comment.deleteMany({ blogId: req.params.id });
    await Blog.findByIdAndDelete(req.params.id);
    
    return res.redirect("/");
  } catch (error) {
    // console.log(error);
    return res.redirect("/");
  }
});


//edit blog
router.post("/edit/:id", async (req, res) => {
  
  const blog = await Blog.findById(req.params.id);
  if (!req.user || blog.createdBy.toString() !== req.user.id)
    return res.redirect("/");

  blog.title = req.body.title;
  blog.body = req.body.body;
  blog.isEdited = true;
  await blog.save();

  res.redirect(`/blog/${blog._id}`);
});



// generate summary
router.post("/generate-summary/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    // If summary exists AND blog not edited → return old summary
    if (
      blog.summary &&
      blog.summary !== "Summary can't be generated." &&
      blog.isEdited === false
    ) {
      return res.json({ summary: blog.summary });
    }

   const summary = await generateSummary(blog);

    blog.summary = summary;
    blog.isEdited = false;  // reset after regeneration
    await blog.save();

    return res.json({ summary: blog.summary });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating summary");
  }
});

module.exports = router;