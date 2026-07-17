import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { config } from "../config/config.js";

async function sendTokenResponse(user, res, message, redirectUrl = null) {
  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  if (redirectUrl) {
    return res.redirect(redirectUrl);
  }

  return res.status(200).json({
    message,
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
    },
  });
}

export const registerUser = async (req, res) => {
  const { email, contact, password, fullname, isSeller } = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "contact";
      const message =
        field === "email"
          ? "This email is already in use."
          : "This contact number is already in use.";
      return res.status(400).json({ field, message });
    }

    const user = await userModel.create({
      email,
      contact,
      password,
      fullname,
      role: isSeller ? "seller" : "buyer",
    });

    await sendTokenResponse(user, res, "User registered successfully");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password)

  try {
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    await sendTokenResponse(user, res, "User logged in successfully");
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const googleAuthCallback = async (req, res) => {
  try {
    const profile = req.user;
    const email = profile.emails[0].value;

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        email,
        fullname: profile.displayName,
        googleId: profile.id,
        role: "buyer",
      });
    }

    await sendTokenResponse(
      user,
      res,
      "User logged in with Google successfully",
      "http://localhost:5173/",
    );
  } catch (error) {
    console.error("Error in Google auth callback:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      message: "User fetched successfully",
      success: true,
      user: {
        id: user._id,
        email: user.email,
        contact: user.contact,
        fullname: user.fullname,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.status(200).json({ success: true, message: "Logged out" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};