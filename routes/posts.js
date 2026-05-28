const express = require("express");
const router = express.Router();

// This handles requests to POST /posts
router.get("/", (res, req) => {
  //   const mockPosts = [
  //     {
  //       id: 1,
  //       title: "First Post",
  //       content: "This is the content of the first post.",
  //     },
  //     { id: 2, title: "express tips", content: "keep it simple" },
  //   ];

  //   res.json(mockPosts);

   // req.body contains the data sent by the React frontend (e.g., from a form)
  const { title, content } = req.body;

   // Validation: Ensure the user actually sent data
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

   // Log the data to the console to verify it arrived
  console.log("Received new post:", { title, content });

  // 201 is the standard HTTP status code for "Successfully Created"
  res.status(201).json({
    message: "Post created successfully!",
    data:{title, content} // Sending back the data to confirm receipt
    });
});

module.exports = router;
