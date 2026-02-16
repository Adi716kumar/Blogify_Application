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
     }
},
{timestamps: true}
);

const Blog = model("blog", blogSchema);

module.exports = Blog;

