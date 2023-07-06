import { Router } from 'express'
import contentController from './content.controller'
import { verifyUserAdmin } from '../../middleware/verifyToken';
import upload from '../../middleware/formdataHandler'

const router = Router()

router.put("/contents/about", verifyUserAdmin, contentController.modifyAboutPages);
router.put("/contents/gallery", verifyUserAdmin, upload.array("images"), contentController.modifyGalleryPages);
router.delete("/contents/gallery", verifyUserAdmin, contentController.deleteImageGallery);
router.get("/contents/:contentType", contentController.getAboutPages);

export default router