const bcrypt = require("bcryptjs"); // library for password security
const User = require("../models/User"); // adapt to match your database model
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user in the database
    const user = await User.findOne({ email }); // searching by unique email

    // 2. If user doesn't exist, stop here
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Check if the password is correct
    // We compare the plain text 'password' with the 'user.password' hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4. Create the 'badge' (the JWT)
    const token = jwt.sign(
      { id: user._id }, // Payload: what we want to remember about the user
      process.env.JWT_SECRET || "default_jwt_secret", // Secret Key: used to sign the token (keep this private!)
      { expiresIn: "1h" }, // Security: the token expires in 60 minutes
    );

    // 5. Send the success response
    res.status(200).json({
      token, // The frontend will save this for future requests
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
};
