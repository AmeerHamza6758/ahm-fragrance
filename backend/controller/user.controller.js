const userModel = require("../models/user.model");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const transporter = require("../config/transporter");

const authController = {
    // signUp: async (req, res) => {
    //     try {
    //         const { userName, email, password, phone, gender, dateOfBirth } = req.body;

    //         const existingUser = await userModel.findOne({ email });
    //         if (existingUser) {
    //             return res.status(400).json({ message: "Email already exists" });
    //         }
    //         const salt = await bcrypt.genSalt(10);
    //         const hashedPassword = await bcrypt.hash(password, salt);

    //         const newUser = new userModel({
    //             userName,
    //             email,
    //             password: hashedPassword,
    //             phone, gender, dateOfBirth
    //         });
    //         await newUser.save();
    //         return res.status(200).json({ message: "user registered successfull", newUser })
    //     }
    //     catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: error.message });
    //     }

    // },

    // ========== SIGN UP WITH AUTO OTP ==========
     signUp: async (req, res) => {
    try {
        const { userName, email, password, phone, gender, dateOfBirth, address } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        const generateOtp = () => {
            return (Math.floor(100000 + Math.random() * 900000)).toString();
        };
        const newOtp = generateOtp();

        // Create new user with OTP
        const newUser = new userModel({
            userName,
            email,
            password: hashedPassword,
            phone, 
            gender, 
            dateOfBirth,
            address: {
                street: address?.street || "",
                city: address?.city || "",
                province: address?.province || "",
                postalCode: address?.postalCode || ""
            },
            otpCode: newOtp,
            otpType: 'email_verification',
            otpExpiresAt: new Date(Date.now() + 60 * 1000), // 60 seconds
            isEmailVerified: false
        });

        await newUser.save();

        // Send OTP email
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome to AHM Fragrances! 🎉</h2>
                <p>Thank you for registering. Please verify your email address using the OTP below:</p>
                <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px;">
                    ${newOtp}
                </div>
                <p>This OTP will expire in <strong>60 seconds</strong>.</p>
                <p>If you didn't create an account, please ignore this email.</p>
                <hr>
                <small>This is an automated message, please do not reply.</small>
            </div>
        `;

        await transporter.sendMail({
            from: `"No Reply" <${process.env.EMAIL_USER}>`,
            to: newUser.email,
            subject: "Verify Your Email - AHM Fragrances",
            html: emailHtml
        });

        return res.status(200).json({ 
            message: "User registered successfully. Please check your email for OTP verification.",
            user: {
                id: newUser._id,
                userName: newUser.userName,
                email: newUser.email,
                isEmailVerified: newUser.isEmailVerified
            }
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
},
    signIn: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "user does not found" });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res
                    .status(400)
                    .json({ message: "invalid password or user name" });
            }

            const token = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.EXPIRES_JWT }
            );


            res.status(200).json({ message: "logon successfull", user, token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    },



    test: async (req, res) => {
        try {
            res.status(200).json({ message: "test successfull" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }


};



const generateOtp = () => {return (Math.floor(100000 + Math.random() * 900000)).toString(); };

const otpHandler = async (req, res) => {
  const { email, type, otpCode } = req.body;

  if (!email || !type) {
    return res.status(400).json({ 
      success: false,
      message: 'Email and type are required.' 
    });
  }

  if (!['email_verification', 'password_reset'].includes(type)) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid type. Must be email_verification or password_reset.' 
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found.' 
      });
    }

    if (otpCode) {

      if (
        !user.otpCode ||
        user.otpCode.toString() !== otpCode.toString() ||
        user.otpExpiresAt < new Date() ||
        user.otpType !== type
      ) {
        return res.status(400).json({ 
          success: false,
          message: 'Invalid or expired OTP.' 
        });
      }

      user.otpVerifiedAt = new Date();
      user.otpCode = null;
      user.otpExpiresAt = null;

      let response = { 
        message: 'OTP verified successfully.' 
      };


      if (type === 'email_verification') {
        user.isEmailVerified = true;
        await user.save();
        
        return res.status(200).json({
          success: true,
          message: 'Email verified successfully.',
          data: {
            email: user.email,
            isEmailVerified: user.isEmailVerified
          }
        });
      }

      if (type === 'password_reset') {
        const token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();
        
        return res.status(200).json({
          success: true,
          message: 'OTP verified successfully.',
          data: {
            tempToken: token,
            email: user.email,
            tokenExpiresIn: '15 minutes'
          }
        });
      }
    }


    // Check if OTP is already sent and still valid
    if (!user.otpCode || user.otpExpiresAt < new Date() || user.otpType !== type) {

      const newOtp = generateOtp();
      user.otpCode = newOtp;
      user.otpType = type;
      user.otpExpiresAt = new Date(Date.now() + 60 * 1000); 
      user.otpVerifiedAt = null;
      await user.save();

      // Send email
      const subject = type === 'email_verification' ? 'Verify Your Email' : 'Password Reset OTP';
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your OTP Code</h2>
          <p>Your OTP for <strong>${type === 'email_verification' ? 'Email Verification' : 'Password Reset'}</strong> is:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px;">
            ${newOtp}
          </div>
          <p>This OTP will expire in <strong>60 seconds</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr>
          <small>This is an automated message, please do not reply.</small>
        </div>
      `;

      await transporter.sendMail({
        from: `"No Reply" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: subject,
        html: emailHtml
      });

      return res.status(200).json({ 
        success: true,
        message: 'OTP sent successfully. Please check your email.'
      });
    }

    return res.status(200).json({ 
      success: true,
      message: 'OTP already sent. Please check your email.'
    });

  } catch (err) {
    console.error("OTP Handler Error:", err);
    return res.status(500).json({ 
      success: false,
      message: 'Server error while processing OTP.',
      error: err.message 
    });
  }
};

const resetPassword = async (req, res) => {
  const { tempToken, newPassword } = req.body;

  if (!tempToken || !newPassword) {
    return res.status(400).json({ 
      success: false,
      message: 'Token and new password are required.' 
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ 
      success: false,
      message: 'Password must be at least 6 characters long.' 
    });
  }

  try {

    const user = await userModel.findOne({ 
      resetToken: tempToken,
      resetTokenExpiresAt: { $gt: new Date() } 
    });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired token.' 
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiresAt = null;
    user.otpCode = null;
    user.otpExpiresAt = null;
    user.otpType = null;
    
    await user.save();

    res.status(200).json({ 
      success: true,
      message: 'Password has been reset successfully.' 
    });

  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ 
      success: false,
      message: 'Server error while resetting password.' 
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await userModel.find()
      .select("-password -otpCode -resetToken")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalUsers = await userModel.countDocuments();

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        totalItems: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await userModel.findById(id).select("-password -otpCode -resetToken");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { userName, phone, gender, dateOfBirth, address } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (userName) user.userName = userName;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (address) {
      user.address = {
        street: address.street || user.address?.street,
        city: address.city || user.address?.city,
        province: address.province || user.address?.province,
        postalCode: address.postalCode || user.address?.postalCode
      };
    }

    await user.save();
    res.status(200).json({ success: true, message: "Profile updated successfully", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
    signUp: authController.signUp,
    signIn: authController.signIn,
    test: authController.test,
    otpHandler,
    resetPassword,
    getAllUsers,
    getUserById,
    updateProfile,
    updatePassword,
    deleteUser: async (req, res) => {
      try {
        const { id } = req.params;
        const user = await userModel.findByIdAndDelete(id);
        if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User deleted successfully" });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
};
