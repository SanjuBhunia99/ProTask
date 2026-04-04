// import express from 'express'
// import { getCurrentUser, loginUser, registerUser, updatePassword, updateProfile } from '../controllers/userController.js';
// import authMiddleware from '../middleware/auth.js';

// const userRouter = express.Router();

// userRouter.post('/register', registerUser);
// userRouter.post('/login', loginUser);

// userRouter.get('/me', authMiddleware, getCurrentUser);
// userRouter.put('/profile', authMiddleware, updateProfile);
// userRouter.put('/password', authMiddleware, updatePassword);
// // userRouter.post("/logout", authMiddleware, logoutUser);

// export default userRouter;

import express from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  updatePassword,
  updateProfile,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", authMiddleware, getCurrentUser);
router.put("/profile", authMiddleware, updateProfile);
router.put("/password", authMiddleware, updatePassword);

export default router;