const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || "your_jwt_secret_key",
    { expiresIn: "7d" },
  );
};

const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  hashPassword,
  comparePassword,
  verifyToken,
};
