import { Router } from "express";
import passport from "passport";
import { config } from "../config/config.js";
import {
  validateRegisterUser,
  validateLoginUser,
} from "../validator/auth.validator.js";
import {
  registerUser,
  loginUser,
  googleAuthCallback,
  getMe,
  logoutUser,
} from "../controllers/auth.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
const router = Router();

/*
 * @description Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
router.post("/register", validateRegisterUser, registerUser);

/*
 * @description Login a user
 * @route POST /api/auth/login
 * @access Public
 */
router.post("/login", validateLoginUser, loginUser);

/*
 * @description Google OAuth login
 * @route GET /api/auth/google
 * @access Public
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

/*
 * @description Google OAuth callback
 * @route GET /api/auth/google/callback
 * @access Public
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect:
      config.NODE_ENV === "development"
        ? "http://localhost:5173/login"
        : "/login",
    session: false,
  }),
  googleAuthCallback,
);

/*
 * @description Get current authenticated user
 * @route GET /api/auth/me
 * @access Private
 */
router.get("/me", authenticateUser, getMe);

/*
 * @description Logout user — clears the auth cookie
 * @route POST /api/auth/logout
 * @access Public (no auth needed, cookie cleared regardless)
 */
router.post("/logout", logoutUser);

export default router;
