const { Router } = require("express");

const router = Router();
const { isAdmin } = require("../middlewares/authorization");
const Blog = require("../model/blog");
const Comment = require("../model/comment");
const { sendRejectionEmail } = require("../services/emailService");

//dashboard
router.get("/dashboard", isAdmin, async (req, res) => {
  const [totalBlogs, pendingBlogsCount, totalComments, pendingCommentsCount] = await Promise.all([
    Blog.countDocuments(),
    Blog.countDocuments({ status: "pending" }),
    Comment.countDocuments(),
    Comment.countDocuments({ status: "pending" }),
  ]);

  return res.render("adminDashboard", {
    stats: {
      totalBlogs,
      pendingBlogsCount,
      totalComments,
      pendingCommentsCount,
    },
  });
});

//all blogs with delete button
router.get("/blogs",isAdmin, async(req, res)=>{
       const allBlogs = await Blog.find().populate('createdBy').sort({createdAt: -1});
       return res.render("adminBlogs",{
          blogs: allBlogs,
        });
})

//delete blogs
router.post("/delete-blog/:id", isAdmin, async (req, res) => {
  try {
    const blogId = req.params.id;

    // Delete related comments
    await Comment.deleteMany({ blogId });

    // Delete blog directly
    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return res.redirect("/admin/blogs");
    }

    return res.redirect("/admin/blogs");

  } catch (error) {
    console.log(error);
    return res.redirect("/admin/blogs");
  }
});


//all comments with delete button
router.get("/comments",isAdmin, async(req, res)=>{
       const allComments = await Comment.find().populate('createdBy').sort({createdAt: -1});
       return res.render("adminComments",{
          comments: allComments,
        });
})

//delete comments
router.post("/delete-comment/:id", isAdmin, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.redirect("/admin/comments");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/comments");
  }
});


//pending blogs
router.get("/pending-blogs", isAdmin, async (req, res) => {
  const pendingBlogs = await Blog.find({ status: "pending" })
    .populate("createdBy")
    .sort({ createdAt: -1 });

  return res.render("pendingBlogs", {
    blogs: pendingBlogs,
  });
});

//approve a pending blog -> publish it
router.post("/approve-blog/:id", isAdmin, async (req, res) => {
  try {
    await Blog.findByIdAndUpdate(req.params.id, { status: "published" });
    return res.redirect("/admin/pending-blogs");
  } catch (error) {
    console.log(error);
    return res.redirect("/admin/pending-blogs");
  }
});

//reject a pending blog -> mark rejected + notify author by email
router.post("/reject-blog/:id", isAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");

    if (!blog) {
      return res.redirect("/admin/pending-blogs");
    }

    const reason = req.body.reason || "Content did not meet our community guidelines.";

    blog.status = "rejected";
    blog.rejectionReason = reason;
    await blog.save();

    const recipientEmail = blog.createdBy?.email || blog.authorSnapshot?.email;
    if (recipientEmail) {
      await sendRejectionEmail(recipientEmail, reason);
    }

    return res.redirect("/admin/pending-blogs");
  } catch (error) {
    console.log(error);
    return res.redirect("/admin/pending-blogs");
  }
});

//pending comments
router.get("/pending-comments", isAdmin, async (req, res) => {
  const pendingComments = await Comment.find({ status: "pending" })
    .populate("createdBy")
    .populate("blogId")
    .sort({ createdAt: -1 });

  return res.render("pendingComments", {
    comments: pendingComments,
  });
});

//approve a pending comment
router.post("/approve-comment/:id", isAdmin, async (req, res) => {
  try {
    await Comment.findByIdAndUpdate(req.params.id, { status: "approved" });
    return res.redirect("/admin/pending-comments");
  } catch (error) {
    console.log(error);
    return res.redirect("/admin/pending-comments");
  }
});

//reject a pending comment
router.post("/reject-comment/:id", isAdmin, async (req, res) => {
  try {
    await Comment.findByIdAndUpdate(req.params.id, { status: "rejected" });
    return res.redirect("/admin/pending-comments");
  } catch (error) {
    console.log(error);
    return res.redirect("/admin/pending-comments");
  }
});

module.exports = router;