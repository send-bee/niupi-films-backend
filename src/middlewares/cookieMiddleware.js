import jwt from "jsonwebtoken"

const jwtMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        const result = jwt.verify(token, process.env.SECRET_JWT_KEY);
        if (result) {
            next()
        } else {
            res.status(401).json({ success: false, message: " You don´t have authorization, invalid token." })
        }
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token from midd...." })
    }
}

export default jwtMiddleware