// FILE: middleware/auth.js (Example path - adapt to your project)
const jwt = require("jsonwebtoken"); // Library to handle tokens

const protect = (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // The header looks like "Bearer eyJhbGci...", so we split it by the space
    // and take the second part (the actual token string).
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token was found at all, stop here and send an error
  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }

  // We found a token! Now we need to see if it's real in the next step...

  // FILE: middleware/auth.js (continued)
  // ... inside the protect function after the "if (!token)" check

  try {
    // Verify the token using your secret key
    // This returns the "payload" (the data we put in the token when the user logged in)
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // adapt to your env variable name

    // Attach the user's ID to the request object.
    // Now, the next function in line can access "req.user" to know who is acting.
    req.user = decoded.id;

    next(); // Tell the server to move to the actual route handler (e.g., Create Post)
  } catch (error) {
    // If verification fails (token expired, fake token, etc.)
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { protect };
