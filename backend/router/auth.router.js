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
router.get("/getAllUsers", authController.getAllUsers);
router.get("/getUserById", authController.getUserById);
router.put("/update-profile", authMiddleware, authController.updateProfile);
router.put("/update-password", authMiddleware, authController.updatePassword);
router.delete("/deleteUser/:id", authController.deleteUser);

module.exports = router;