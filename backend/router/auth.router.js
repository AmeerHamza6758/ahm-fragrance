const express = require('express');
const router = express.Router();
const authController = require("../controller/user.controller");
const {otpHandler, resetPassword }= require("../controller/user.controller");
const { authMiddleware } = require("../middleware/auth.middleware");


router.post("/signUp" , authController.signUp);
router.post("/signIn" , authController.signIn);
router.get("/test" , authMiddleware, authController.test);
router.post("/otp", otpHandler);
router.post("/reset-password", resetPassword);

module.exports = router;