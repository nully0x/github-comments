import {Router} from "express"
import prCommenter from "./prCommenter"

const router = Router()


router.use("/pr-commenter", prCommenter)



export default router


