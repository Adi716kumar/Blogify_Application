const { Schema, model} = require("mongoose");

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: "blog",
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
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
        },
        profileImageURL: {
            type: String,
            required: true
        }
    },
        status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    moderation: {
        label: String,
        confidence: Number,
        reason: String,
    },

}, {timestamps: true});

const Comment = model("comment", commentSchema);
module.exports = Comment;