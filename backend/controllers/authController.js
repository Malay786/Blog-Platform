import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from 'bcryptjs'


const generateToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
}

export const signup = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password) return res.status(400).json({message: "Invalid Credentials"});

        if(password.length < 6) return res.status(400).json({message: "Password must be atleast 6 characters"});

        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(403).json({message: "User already exist, login"});
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });
        const token = generateToken(user._id);
        return res.status(201).json({user, token: token});
    } catch (error) {
        console.log("Error in signup controller: ", error);
        return res.status(500).json({message: "Internal Server error"});
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) return res.status(400).json({message: "Invalid Credentials"});

        const user = await User.findOne({email}).select("+password");
        if(!user) return res.status(403).json({message: "user do not exist, please signup"});

        const isMatched = await bcrypt.compare(password, user.password);
        if(!isMatched) return res.status(403).json({message: "Wrong Password"});

        const token = generateToken(user._id);

        return res.status(201).json({user, token: token});

    } catch (error) {
        console.log("Error in login controller: ", error);
        return res.status(500).json({message: "Internal Server error"});
    }
}

export const getAllUsers = async(req, res) => {
    
}