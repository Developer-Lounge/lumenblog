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

const primaryDbURI = process.env.MONGODB_URI;
const fallbackDbURI =
  process.env.LOCAL_MONGODB_URI || "mongodb://127.0.0.1:27017/myBlogDB";

let isDatabaseConnected = false;

async function connectToDatabase() {
  if (!primaryDbURI) {
    console.warn("MONGODB_URI is not set. Trying local MongoDB fallback...");
  }

  const connectionTargets = [primaryDbURI, fallbackDbURI].filter(Boolean);
  let lastError = null;

  for (const uri of connectionTargets) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });

      isDatabaseConnected = true;
      console.log(
        `Connected to MongoDB successfully (${
          uri.includes("mongodb+srv") ? "Atlas" : "local"
        })!`
      );
      return;
    } catch (error) {
      lastError = error;
      console.warn(`MongoDB connection failed for ${uri}: ${error.message}`);
    }
  }

  isDatabaseConnected = false;
  console.error(
    "MongoDB is unavailable. The server will keep running, but database-backed routes may fail.",
    lastError
  );
}

function requireDatabase(req, res, next) {
  if (!isDatabaseConnected || mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message:
        "Database is unavailable. Start MongoDB locally or provide a reachable MONGODB_URI.",
    });
  }

  next();
}

connectToDatabase();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Authentication Routes
app.use("/api/auth", require("./routes/auth"));

// Protected Post Routes Test
app.use("/api/post-auth-test", require("./routes/postRoutes"));

// GET all posts (Public)
app.get("/api/posts", requireDatabase, async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
});

// CREATE a new post (Public)
app.post("/api/posts", requireDatabase, async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const newPost = await Post.create({
      title,
      content,
      author: author || "Anonymous",
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({
      message: "Could not create post",
      error: error.message,
    });
  }
});

// DELETE a specific post (Public)
app.delete("/api/posts/:id", requireDatabase, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: "Error deleting post",
      error: error.message,
    });
  }
});
