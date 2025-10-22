import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token = req.headers.authorization;

    try {
        // Check if token exists and starts with Bearer
        if (token && token.startsWith('Bearer ')) {
            // Extract token from "Bearer <token>"
            token = token.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized, no token" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({ success: false, message: "Not authorized, user not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
};
