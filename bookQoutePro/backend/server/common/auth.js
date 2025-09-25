import jwt from "jsonwebtoken";
import config from "config";
import responseMessages from "../../assets/responseMessages.js";
import userServices from "../api/services/userServices.js";
const { findUserById } = userServices;
const jwtsecret=process.env.JWT_SECRET

async function verifyToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ statusCode:'404', responseMessages: responseMessages.NO_TOKEN });
    }
    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
         
        const userResult = await findUserById({ _id: decoded._id });
        if (!userResult) {
            return res.status(404).json({ statusCode:'404', responseMessages: responseMessages.USER_NOT_FOUND });
        }
        req.userId = userResult._id;
        next();
    } catch (err) {        
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ statusCode:'404', responseMessages: responseMessages.TOKEN_EXPIRED });
        } else {
            return res.status(401).json({ statusCode:'404', responseMessages: responseMessages.UNAUTHORIZED });
        }
    }
}

// Export as an object with named property
const authMiddleware = {
    verifyToken
};

export default authMiddleware;