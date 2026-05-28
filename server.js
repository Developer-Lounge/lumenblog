require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const Post = require("./server/models/Post");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = 5000;

// Connect to MongoDB
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI)
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Authentication Routes
app.use("/api/auth", require("./routes/auth"));

// Protected Post Routes Test
app.use("/api/post-auth-test", require("./routes/postRoutes"));

// GET all posts (Public)
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find(); // Fetch all posts using Mongoose
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error: error.message });
  }
});

// CREATE a new post (Public)
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const newPost = await Post.create({
      title,
      content,
      author: author || "Anonymous"
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: "Could not create post", error: error.message });
  }
});

// DELETE a specific post (Public)
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params; // Grabs the ID from the URL

    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 204 means "No Content" — we deleted it, so there's nothing left to send back
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error: error.message });
  }
});