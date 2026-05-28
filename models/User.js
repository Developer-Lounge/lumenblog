const mongoose = require("mongoose"); // Import the mongoose library to interact with MongoDB

// We extract the Schema constructor from mongoose to create our blueprint
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String, // Tells the database this must be text
      required: [true, "Email is required"], // The user cannot sign up without an email
      unique: true, // Prevents two users from using the same email address
      lowercase: true, // Automatically converts "User@Example.com" to "user@example.com"
      trim: true, // Removes accidental spaces at the beginning or end
    },
    password: {
      type: String, // Even though it's a "secret," it is stored as a string of characters
      required: [true, "Password is required"], // Every account needs a password
      minlength: [6, "Password must be at least 6 characters long"], // Basic security rule
    },
  },
  {
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields for us
  },
);
// We create a model from the schema, which gives us an interface to interact with the database

const User = mongoose.model("User", userSchema);

module.exports = User; // We export the User model so it can be used in other parts of our application