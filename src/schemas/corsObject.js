const corsObject = {
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
            process.env.CORS_FIRST_OBJ,
            process.env.CORS_SECOND_OBJ,
        ]

        if (ACCEPTED_ORIGINS.includes(origin)) {
            return callback(null, true)
        }
        if (!origin) {
            return callback(null, true)
        }
        return callback(new Error("Not allowed by CORS"))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

export default corsObject