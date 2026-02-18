Blogify 📝

A full-stack blogging platform with authentication, image uploads, and cloud deployment.

🚀 Live Demo

👉 https://blogify-app-i4za.onrender.com

📌 Features

User authentication (Signup / Login / Logout)

JWT-based authentication using cookies

Create, edit, and delete blog posts

Upload blog cover images

Upload user profile images

Comment system on blogs

Authorization (only author can edit/delete their blog)

Responsive and modern UI

Production-ready deployment

🛠️ Tech Stack
Frontend

EJS (Server-side rendering)

HTML, CSS

Bootstrap (with custom styling)

Backend

Node.js

Express.js

JWT Authentication

Multer (file handling)

Database

MongoDB Atlas (Cloud Database)

Mongoose ODM

Cloud Services

Cloudinary – Image storage (profile & blog images)

Render – Application hosting

🧠 Architecture Overview
Browser
   ↓
Render (Node.js + Express)
   ↓
MongoDB Atlas (Database)
   ↓
Cloudinary (Image Storage)

🔐 Authentication Flow

User signs up / logs in

JWT token is generated on the server

Token is stored in cookies

Middleware verifies token on each request

Protected routes are accessible only to authenticated users

📷 Image Upload Flow

Multer handles multipart/form-data

Images are streamed directly to Cloudinary

Cloudinary returns a secure URL

Only the image URL is stored in MongoDB

Production servers have ephemeral storage, so images are stored on Cloudinary instead of local disk.


App will run at:
http://localhost:7000

🚀 Deployment

Backend deployed on Render

Database hosted on MongoDB Atlas

Images stored on Cloudinary

Environment variables configured via Render dashboard


👤 Author

Aditya Kumar
Computer Science Engineering (Data Science) Student
Aspiring Backend / Full Stack Developer

⭐ Acknowledgements

MongoDB Atlas

Cloudinary

Render

