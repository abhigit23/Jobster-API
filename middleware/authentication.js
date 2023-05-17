const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Invalid Authentication");
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const testUser = payload.userId === '6463bbc9adf2356e0a32e403'
    req.user = { userId: payload.userId, testUser };
    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid Authentication");
  }
};

module.exports = auth;