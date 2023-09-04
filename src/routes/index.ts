import {Router} from "express"
import prComments from "./pullRequest"
import issueComments from "./issues"

const router = Router()


router.use("/pr-comments", prComments)
router.use("/issue", issueComments)



export default router