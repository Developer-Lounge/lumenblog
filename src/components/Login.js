import React, { useState } from "react";
import axios from "axios"; // A library used to make HTTP requests to a server

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the browser from reloading the page

    try {
      // Sending a POST request to our login API endpoint
      // We use 'await' because network requests take time to finish
      const response = await axios.post(
        "https://api.example.com/login",
        credentials,
      ); // adapt to match your project

      console.log("Login successful!", response.data);
      // You might wonder: "Where do we store the token?"
      // We will handle global auth state in a future lesson.
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || "Something went wrong",
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={credentials.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition duration-200"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;
