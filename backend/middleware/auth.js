// ./middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authentication failed: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, 'your_jwt_secret'); // Ensure 'your_jwt_secret' matches your config
        const userRole = decodedToken.role;

        if (userRole !== 'Admin' && userRole !== 'Faculty') {
            return res.status(403).json({ message: "Access denied" });
        }

        req.user = { id: decodedToken.userId, role: userRole };
        next();
    } catch (error) {
        return res.status(401).json({ message: "Authentication failed: Invalid token" });
    }
};
