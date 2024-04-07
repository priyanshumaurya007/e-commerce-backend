const jwt = require('jsonwebtoken');
const JWT_SECRET = "my_secret";

const verifyAuthToken = ( req, res, next ) => {
    let token = req.headers.authorization;
    token = token?.split(' ')[1];

    if(!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const useremail = decoded?.useremail;

        req.user = useremail;
        next();
        
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please log in again.' });
        } else {
            return res.status(400).json({ message: 'Invalid token.' });
        }
    }
};

module.exports = { verifyAuthToken };