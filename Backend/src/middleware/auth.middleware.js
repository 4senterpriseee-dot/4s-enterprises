import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { config } from "../config/config.js";

export const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

export const authenticateSeller = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.role !== "seller") {
      return res.status(403).json({ message: "Forbidden: Not a seller" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
