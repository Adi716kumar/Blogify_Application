# 🚀 Blogify — AI-Powered Blogging Platform

Blogify is a modern full-stack blogging application built with **Node.js, Express, MongoDB, and EJS**, featuring an **Admin Dashboard**, **Role-Based Access Control**, and **AI-powered moderation using Gemini**.

---

## 🌟 Features

### 👤 User Features

* Create and publish blogs
* Add and manage comments
* User authentication (login/signup)
* Profile with image support (Cloudinary)

---

### 🛡️ Admin Features

* Admin Dashboard
* View all blogs
* Delete inappropriate blogs
* View all comments
* Delete comments
* Role-based access control (ADMIN / USER)

---

### 🤖 AI Integration (Gemini)

* Automatic blog/content moderation
* AI-generated summaries
* Scope for approval/rejection system

---

## 🏗️ Tech Stack

* **Frontend:** EJS, CSS (Modern Dark UI)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas
* **Image Storage:** Cloudinary
* **AI Integration:** Google Gemini API
* **Deployment:** Render

---

## 📁 Project Structure

```
Blogify/
│
├── routes/
│   ├── admin.js
│   ├── blog.js
│   └── user.js
│
├── models/
│   ├── user.js
│   ├── blog.js
│   └── comment.js
│
├── middleware/
│   ├── auth.js
│   └── isAdmin.js
│
├── views/
│   ├── admin/
│   │   ├── dashboard.ejs
│   │   └── blogs.ejs
│   └── partials/
│       └── navbar.ejs
│
├── public/
├── .env
├── app.js
└── package.json
```

---

## 🔐 Authentication & Authorization

* **Authentication:** JWT-based login system
* **Authorization:** Role-based access control using middleware

```js
// Example
if (req.user.role !== "ADMIN") {
  return res.status(403).send("Access Denied");
}
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/blogify.git
cd blogify
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
PORT=7000
MONGO_URL=your_mongodb_connection
JWT_SECRET=your_secret
CLOUDINARY_URL=your_cloudinary_url
GEMINI_API_KEY=your_api_key
```

### 4. Run the app

```bash
npm run dev
```

---

## 🧪 Admin Access

To make yourself admin:

```json
{
  "$set": {
    "role": "ADMIN"
  }
}
```

Update this in MongoDB Atlas → `blogify.users`

---

## 🔥 Future Enhancements

* Blog approval system (Pending → Approved)
* Comment moderation system
* AI toxicity score dashboard
* Search & filtering
* Pagination
* Notifications system

---

## 💡 Key Learnings

* Role-Based Access Control (RBAC)
* Secure route handling
* MongoDB relationships & cascading deletes
* AI integration in real-world apps
* Full-stack architecture design

---

## 👨‍💻 Author

**Aditya Kumar**
Computer Science Engineering (2027)

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and share your feedback!

---
