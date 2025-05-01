import { Router } from "express";
import { addComment, deleteComment, updateComment } from "../controllers/commentController.js";
import { ProtectedRoute } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/:postId', ProtectedRoute, addComment);
router.delete('/delete/:commentId', ProtectedRoute, deleteComment);
router.put('/update/:commentId', ProtectedRoute, updateComment);

export default router;