import express from 'express';
import { Router } from 'express';
import { getAllUsers, login, signup } from '../controllers/authController.js';
import { ProtectedRoute } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/getuser", ProtectedRoute, authorizeRoles("admin"), getAllUsers);

export default router;