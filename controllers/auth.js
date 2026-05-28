const bcrypt = require("bcryptjs"); // Library for hashing passwords
const User = require("../models/User"); // Your database model
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    // Safety guard for empty body / missing Content-Type header
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body is empty or not parsed. Please ensure you are sending a JSON body and setting the 'Content-Type' header to 'application/json' in Postman."
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Check if user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate a salt (random data) and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user with the scrambled password
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    // Safety guard for empty body / missing Content-Type header
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body is empty or not parsed. Please ensure you are sending a JSON body and setting the 'Content-Type' header to 'application/json' in Postman."
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Look for the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the incoming password with the hashed one in the DB
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create a JWT.
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "default_jwt_secret",
      { expiresIn: "1h" }, // The token expires in 1 hour for security
    );

    // Send the token and user data back to the frontend
    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};