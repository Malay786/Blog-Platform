// import jwt from 'jsonwebtoken'
// import User from '../models/User.js';

// export const ProtectedRoute = async (req, res, next) => {
//     let token;
//     console.log("first")
//     if(
//         req.headers.authorization && 
//         req.headers.authorization.startsWith("Bearer")
//     ) {
//         try {
//             console.log("first")
//             token = req.headers.authorization.split(" ")[1];
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             console.log("decoded: ", decoded)
//             req.user = await User.findOne(decoded._id) // ?? decoded._id or decoded.id check this 
//             next();
            
//         } catch (error) {
//             return res.status(401).json({message: "Not authorized, token failed"})
//         }
//     }
//     if(!token) {
//         console.log("second")
//         return res.status(401).json({message: "Not authorized, no token found"})
//     }
// };


import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const ProtectedRoute = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user (use .select('-password') to exclude sensitive fields)
      const user = await User.findById(decoded.id).select('-password'); // or decoded._id? Check your JWT payload!

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = user;  // attach user to request

      next();
    } catch (error) {
      console.error("JWT Error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token found" });
  }
};