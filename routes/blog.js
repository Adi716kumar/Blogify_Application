const { Router } = require("express");
// const multer = require("multer");
// const path = require("path");
const upload = require("../middlewares/upload");
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const router = Router();
const User = require("../model/users");
const Blog = require("../model/blog");
const Comment = require("../model/comment");
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
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

  const comment = await Comment.create({
	content: req.body.content,
	blogId: req.params.blogId,
	createdBy: req.user.id,
  authorSnapshot: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      profileImageURL: req.user.profileImageURL,
    },
  });
  // console.log(comment);

  return res.redirect(`/blog/${req.params.blogId}`);
});

/* Create Blog */
router.post("/create-blog", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
	title,
	body,
	createdBy: req.user.id,
	coverImageURL: req.file ? req.file.path : null,
   authorSnapshot: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
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
  await blog.save();

  res.redirect(`/blog/${blog._id}`);
});

//generate summary
router.post("/generate-summary/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).send("Blog not found");
    }

   if (blog.summary) {
        return res.json({ summary: blog.summary });
      }


    //prompt
    const prompt = `
                  You are a professional content editor.

                  Read the blog post carefully and identify the language of the content.

                  Generate a 5-6 sentence summary in the SAME language as the original blog.

                  Do not mention explicitly in the blog about the language used.

                  Guidelines:
                  - Do not translate the language.
                  - Keep the tone professional and clear.
                  - Preserve the main idea and key insights.
                  - Do not add new information.
                  - Do not use introductory phrases like "Here is the summary".
                  - Keep it under 120 words.
                  - If there are some random or meaningless words or sentence like "bdchihuvhrv vbibrv" return summary can't be generated.

                  Blog Content:
                  ${blog.body}
                  `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.3,
      },
    });

    blog.summary = response.text;
    await blog.save();

    return res.json({ summary: blog.summary });
  } 
  catch (error) {
    console.error(error);
    res.status(500).send("Error generating summary");
  }
});

module.exports = router;