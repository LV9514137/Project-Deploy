import jwt from "jsonwebtoken"

const generateUserToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })
}

export default generateUserToken;