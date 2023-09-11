import {Router} from "express"
import prComments from "./pullRequest"
import issueComments from "./issues"

const router = Router()


router.use("/", prComments)
router.use("/issues", issueComments)



export default router