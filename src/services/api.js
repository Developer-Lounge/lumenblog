// import React, { useEffect } from "react";
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
//   timeout: 5000,

//   headers: {
//     "content-type": "application/json",
//   },
// });

// export default api;

// export const getPosts = async () => {
//   try {
//     const response = await api.get("/posts");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     throw error;
//   }

//   useEffect(() => {
//     getPosts(); // ← Called when component mounts
//   }, []); // Empty array = runs once

//   return <div>Check the console!</div>;
// };

import React, { useState, useEffect } from 'react';

function BlogPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define getPosts function
  const getPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      const data = await response.json();
      console.log('Posts from backend:', data); // 👈 CHECK CONSOLE
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  app.get('/api/posts', async (req, res) => {
  try {
    const posts = await db.getPosts(); // Or your database logic
    res.json(posts);
  } catch (error) {
    console.error(error); // This logs the actual error to your server terminal
    res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
  }
});
  // Call getPosts inside useEffect
  useEffect(() => {
    console.log('Component mounted - calling getPosts()');
    getPosts();
  }, []); // Empty dependency array

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Blog Posts</h2>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}

export default BlogPosts;
