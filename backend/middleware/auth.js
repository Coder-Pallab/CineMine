import jwt from 'jsonwebtoken';

export const verifyAdmin = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

            if (decoded.role !== 'admin') {
                return res.status(401).json({ success: false, message: "Not Authorized as admin" });
            }
            req.user = decoded;
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ success: false, message: "Not Authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized, no token" });
    }
};

export const verifyToken = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
            req.user = decoded;
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ success: false, message: "Not Authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized, no token" });
    }
};

export const verifyCinemaHallOwner = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

            if (decoded.role !== 'cinemaHallOwner') {
                return res.status(401).json({ success: false, message: "Not Authorized as cinema hall owner" });
            }
            req.user = decoded;
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ success: false, message: "Not Authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized, no token" });
    }
};