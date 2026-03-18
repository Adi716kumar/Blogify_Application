const { Router } = require("express");

const router = Router();
const { isAdmin } = require("../middlewares/authorization");
const Blog = require("../model/blog");
const Comment = require("../model/comment");

//dashboard
router.get("/dashboard", isAdmin, (req, res) => {
  return res.render("adminDashboard");
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
router.post("/delete-comment/:id", async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.redirect("/admin/comments");
  } catch (error) {
    console.log(error);
    res.redirect("/admin/comments");
  }
});

// router.get("/pending-blogs", ...)
// router.get("/pending-comments", ...)

module.exports = router;