import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    dateJoined: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('User', userSchema);

// Small Hint:
// Later during login, remember that when you query 
// the user to verify password, you’ll need to 
// use .select('+password') because by default password 
// is excluded.