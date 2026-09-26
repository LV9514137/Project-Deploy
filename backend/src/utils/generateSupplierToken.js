import jwt from "jsonwebtoken"

const generateSupplierToken = (supplierId) => {
    return jwt.sign({ supplierId }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })
}

export default generateSupplierToken;