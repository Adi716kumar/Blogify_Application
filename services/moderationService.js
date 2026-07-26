// moderationService.js

const { classifyContent } = require("./geminiServices");

async function moderateContent(content) {
  const result = await classifyContent(content);

   // If Gemini failed
  if (result.error) {
    return {
      ...result,
      action: "pending", // safest fallback
    };
  }

  const { label, confidence, reason, category } = result;

  let action = "pending";

  if (label === "SAFE" && confidence > 0.85) {
    action = "published";
  } 
  else if (label !== "SAFE" && confidence > 0.75) {
    action = "reject";
  } 
  else {
    action = "pending";
  }

  return {
    ...result,
    action, // publish | reject | pending
  };
}

module.exports = {
  moderateContent,
};