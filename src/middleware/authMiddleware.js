import jwt from "jsonwebtoken"; // library used to verify tokens

const verifyToken = (req, res, next) => {
  // Look for the 'authorization' header in the incoming request
  const authHeader = req.headers["authorization"]; // adapt to match your project

  // Check if the header exists and starts with "Bearer "
  // We split the string by the space to get the actual token after "Bearer"
  const token = authHeader && authHeader.split(" ")[1];

  // If there is no token, stop here and tell the user they are unauthorized
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No token provided" });
  }

  // ... next step goes here
  try {
    // Use the secret key to check if the token is valid
    // process.env.JWT_SECRET is a private variable stored on your server
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // If successful, we attach the user data (payload) to the request object
    // This makes 'req.user' available to all functions that run after this
    req.user = verified;

    // Tell the server to move to the next function (the actual route logic)
    next();
  } catch (error) {
    // If verification fails (token expired or fake), send an error response
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
