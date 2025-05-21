const jwtMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        console.log(req.cookies)
        const result = jwt.verify(token, process.env.SECRET_JWT_KEY);
        console.log(result)
        if (result) {
            next()
        } else {
            res.status(401).json({ success: false, message: "Invalid token." })
        }
        next()
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token from midd...." })
    }
}

export default jwtMiddleware