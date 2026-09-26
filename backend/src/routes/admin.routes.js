import {Router} from "express"
import { loginAdmin} from "../controller/user.controller.js"

const router= Router()

router.post("/login", loginAdmin)

export default router