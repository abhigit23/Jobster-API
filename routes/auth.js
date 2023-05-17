const express = require("express");
const router = express.Router();
const authUser = require("../middleware/authentication");
const authTestUser = require("../middleware/testUser");

const rateLimiter = require("express-rate-limit");

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    msg: "Too many requests from this IP, please try again after 15 minutes",
  },
});

const { register, login, updateUser } = require("../controllers/auth");

router.route("/register").post(apiLimiter, register);
router.route("/login").post(apiLimiter, login);
router.route("/updateUser").patch(authUser, authTestUser, updateUser);

module.exports = router;
