import { Router } from "express";
import { createPost, deletePost, getAllPosts, getSinglePost, toggleLike, updatePost } from "../controllers/postController.js";
import { ProtectedRoute } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = Router();

router.post('/create', ProtectedRoute, createPost);
router.get('/get', ProtectedRoute, getAllPosts);
router.get('/get/:id', ProtectedRoute, getSinglePost);
router.put('/update/:id', ProtectedRoute, updatePost);
// both admin and the author can delete the post
router.delete('/delete/:id', ProtectedRoute, deletePost);
router.put('/:postId/like', ProtectedRoute, toggleLike);

export default router;