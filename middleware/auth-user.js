const jwt = require("jsonwebtoken");

module.exports = function authUser(req, res, next) {
  const token = req.header("auth-user");
  if (!token) {
    return res.status(401).send("Unauthorized!");
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).send("Invalid Token!");
  }
};
