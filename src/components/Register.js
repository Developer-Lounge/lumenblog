import React, { useState } from "react";

const Register = () => {
  // Initializing state with an object to hold all form fields
  // useState returns the current value and a function to update it
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // This function updates the specific field in our state object
  const handleChange = (e) => {
    // e.target refers to the input element that triggered the change
    setFormData({
      ...formData, // Keep all existing data using the spread operator
      [e.target.name]: e.target.value, // Update only the field that changed
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Create an Account</h2>
      {/* Form UI goes here */}
      // Inside the Register component return statement:
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            name="username" // Matches the key in our state object
            value={formData.username} // Tells the input to show what's in React state
            onChange={handleChange} // Calls our function whenever the user types
            className="w-full p-2 border rounded" // Tailwind styling
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
