const { Schema, model, mongoose } = require("mongoose");

const blogSchema  = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    coverImageURL: {
        type: String,
        required: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    isEdited : {
        type: Boolean,
        default: false,
    },
    authorSnapshot: {
        id: {
            type: Schema.Types.ObjectId
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String
        }
     },
     summary: {
        type: String,
        default: "",
     },
      // NEW FIELDS
    status: {
        type: String,
        enum: ["pending", "published", "rejected"],
        default: "pending",
    },
    moderation: {
        label: String,        // SAFE / SPAM / HATE etc.
        confidence: Number,   // 0 to 1
        reason: String,
        category: String,   // history, sports, political
    },
    rejectionReason: String,
},
{timestamps: true}
);

const Blog = model("blog", blogSchema);

module.exports = Blog;

