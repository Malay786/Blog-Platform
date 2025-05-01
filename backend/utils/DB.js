import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';

const connectionDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MONGODB!")
    } catch (error) {
        console.log("DB connection failed: ", error);
    }
}

export default connectionDB