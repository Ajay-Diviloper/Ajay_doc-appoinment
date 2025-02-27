const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    // Check if the Authorization header exists
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Authorization token is missing or invalid",
      });
    }

    // Extract token from the header
    const token = authHeader.split(" ")[1];

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Unauthorized user",
        });
      } else {
        // Attach the decoded user ID to the request body or req.user
        req.body.id = decoded.id;
        next();
      }
    });
  } catch (err) {
    console.error(err);
    res.status(501).send({
      success: false,
      message: "Error in authorization",
    });
  }
};
