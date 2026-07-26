// services/emailService.js

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendRejectionEmail(to, reason) {
  try {
    await transporter.sendMail({
      from: `"Blogify" <${process.env.EMAIL}>`,
      to,
      subject: "Blog Rejected",
      text: `Your blog was rejected due to: ${reason}`,
    });

    // console.log("📧 Email sent successfully");
  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
}

module.exports = { sendRejectionEmail };