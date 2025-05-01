import express from 'express'
import dotenv from 'dotenv'
import connectionDB from './utils/DB.js';
dotenv.config();
import cors from 'cors'

import authRoutes from './routes/authRoutes.js'
import postRoutes from './routes/postRoutes.js'
import commentRoutes from './routes/commentRoutes.js'

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);


connectionDB();
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})

