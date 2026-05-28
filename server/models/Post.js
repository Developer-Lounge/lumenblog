const mongoose = require("mongoose"); // Import the mongoose library to interact with MongoDB

// We use the 'new' keyword to create a unique instance of a Schema
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String, // Tells MongoDB this must be text
      required: true, // The database will reject the post if the title is missing
      trim: true, // Automatically removes accidental whitespace from the start/end
    },
    content: {
      type: String,
      required: true, // A blog post without content isn't a post!
    },
    author: {
      type: String, // For now, we store the author's name as text
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields for us
  },
);

// mongoose.model takes two arguments:
// 1. The name of the model ('Post')
// 2. The schema to use (postSchema)
const Post = mongoose.model("Post", postSchema);

// Export the model so we can use it in our routes to create new blog posts
module.exports = Post;
