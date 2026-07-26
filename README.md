# 📝 Blogify

**Blogify** is a full-stack blogging platform with built-in **AI-powered content moderation** — every blog post and comment is automatically screened by Google Gemini before it ever goes public. Safe content publishes instantly, borderline content is queued for human review, and clearly inappropriate content is rejected with an automated email notice to the author.

**🔗 Live Demo:** [ https://blogify-application-hsh2.onrender.com ]

<!--
🖼️ Screenshots

| Home Feed | Blog Detail + AI Summary | Admin Dashboard |
|---|---|---|
| _add screenshot_ | _add screenshot_ | _add screenshot_ |
-->

---

## ✨ Features

### Core Blogging
- User authentication (JWT + HTTP-only cookies, password hashing with salted HMAC)
- Create, edit, and delete blog posts with cover image uploads
- Threaded comments on every blog
- Author profile images and attribution snapshots preserved even if a user later updates/deletes their account

### 🤖 AI-Powered Moderation
- Every blog post and comment is sent to **Google Gemini** for classification before publishing
- Gemini returns a label (`SAFE`, `SPAM`, `HATE`, `VIOLENCE`, `OFFENSIVE`, `SEXUAL`, `ABUSIVE`), a confidence score, a category, and a human-readable reason
- **Confidence-based routing:**
  - ✅ High-confidence safe content → published instantly
  - ⏳ Ambiguous content → held for manual admin review
  - ❌ High-confidence violation → rejected automatically, with an email sent to the author explaining why
- The same moderation pipeline runs on both **blogs and comments**

### ✨ AI Blog Summaries
- One-click AI-generated summary of any blog post (Gemini), cached until the post is edited again

### 🛠️ Admin Dashboard
- Live counts of total/pending blogs and comments
- Review queue for pending blogs and comments with one-click **Approve** / **Reject**
- Full blog and comment management with delete controls
- Role-based access control (`USER` / `ADMIN`)

### 🎨 UI
- Responsive, modern dark-themed UI (Bootstrap 5 + custom CSS)
- Sticky navbar, sitewide footer
- Client-side live search on the home feed

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Templating | EJS |
| Database | MongoDB (Atlas) with Mongoose |
| Auth | JWT, HTTP-only cookies, salted HMAC password hashing |
| AI | Google Gemini (`@google/genai`) — content moderation + summarization |
| Image Storage | Cloudinary |
| Email | Nodemailer (Gmail SMTP) |
| File Uploads | Multer + `multer-storage-cloudinary` |
| Deployment | Render |

---

## 🏗️ Architecture

```
Blogging-App/
├── app.js                    # App entry point, DB connection, global middleware
├── config/
│   └── cloudinary.js         # Cloudinary configuration
├── middlewares/
│   ├── authentication.js     # JWT cookie verification
│   ├── authorization.js      # Admin-only route guard
│   └── upload.js             # Multer + Cloudinary storage config
├── model/
│   ├── users.js
│   ├── blog.js                # includes status + moderation metadata
│   └── comment.js             # includes status + moderation metadata
├── routes/
│   ├── user.js                # signup / signin / logout
│   ├── blog.js                # CRUD, comments, AI summary
│   └── admin.js               # dashboard, review queues, approve/reject
├── services/
│   ├── auth.js                 # JWT sign/verify
│   ├── geminiServices.js       # Gemini API calls (classify + summarize)
│   ├── moderationService.js    # Confidence-based publish/pending/reject logic
│   └── emailService.js         # Rejection email notifications
└── views/                      # EJS templates + partials (nav, footer, head, scripts)
```

**Moderation flow:**

```
User submits blog/comment
        │
        ▼
 Gemini classifies content
 (label + confidence + reason + category)
        │
   ┌────┴─────┬─────────────┐
   ▼          ▼             ▼
 SAFE      Ambiguous    Clearly unsafe
 conf>0.85 confidence   conf>0.75
   │          │             │
   ▼          ▼             ▼
Published   Pending      Rejected
 (live)   (admin queue)  + email sent
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB Atlas connection string
- A Google Gemini API key
- Cloudinary account (cloud name, API key, API secret)
- A Gmail account with an **App Password** (for SMTP)

### Installation

```bash
git clone <your-repo-url>
cd Blogging-App
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URL=your_mongodb_atlas_connection_string
PORT=8000

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GEMINI_API_KEY=your_gemini_api_key

EMAIL=your_gmail_address
EMAIL_PASS=your_gmail_app_password

JWT_SECRET=a_long_random_secret_string
```

### Run locally

```bash
# development (with nodemon)
npm run dev

# production
npm start
```

The app will be running at `http://localhost:<PORT>`.

---

## 🔐 Roles

| Role | Access |
|---|---|
| `USER` | Create/edit/delete own blogs, comment, view public content |
| `ADMIN` | Everything a user can do, plus the admin dashboard, review queues, and delete controls on any blog/comment |

---

## 🗺️ Roadmap / Future Improvements

- [ ] JWT expiry & refresh token flow
- [ ] Rate limiting on auth and post-creation routes
- [ ] Server-side search via MongoDB text indexes
- [ ] Pagination on the home feed
- [ ] Email verification on signup
- [ ] Admin action audit log
- [ ] Automated test suite (Jest)
- [ ] Dockerized deployment
- [ ] CI pipeline (GitHub Actions)

---

## 👤 Author

**Aditya**
B.Tech CSE (Data Science), Pranveer Singh Institute of Technology, Kanpur

---

## 📄 License

This project is licensed under the ISC License.
