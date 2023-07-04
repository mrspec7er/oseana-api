import { Router } from 'express'
import contentController from './content.controller'
import { verifyUserAdmin } from '../../middleware/verifyToken';

const router = Router()

router.put("/contents/about", verifyUserAdmin, contentController.modifyAboutPages);
router.get("/contents/about", contentController.getAboutPages);

export default router