import { Request, Response } from "express";
import {
  badRequestResponse,
  errorResponse,
  mutationSuccessResponse,
} from "../../utility/apiResponse";
import contentService from "./content.service";
import { ContentType } from "@prisma/client";

async function modifyAboutPages(req: Request, res: Response) {
  const { title, body } = req.body;

  try {
    if (!title || !body) {
      return badRequestResponse(res, "Title and body undefine!");
    }

    const aboutPages = await contentService.modifyAboutPages(title, body);

    return mutationSuccessResponse(res, { ...aboutPages });
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
}

async function modifyGalleryPages(req: Request, res: Response) {
  const { title } = req.body;
  const images = req.files;

  try {
    console.log(title, images);

    if (!title || !images) {
      return badRequestResponse(res, "Title and images undefine!");
    }

    const galleryPages = await contentService.modifyGalleryPages(
      title,
      images as Express.Multer.File[]
    );

    return mutationSuccessResponse(res, { galleryPages });
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
}

async function deleteImageGallery(req: Request, res: Response) {
  const { imageURL } = req.query;

  try {
    if (typeof imageURL !== "string") {
      return badRequestResponse(res, "ImageURL undefine!");
    }

    const galleryPages = await contentService.deleteImageGallery(imageURL);

    return mutationSuccessResponse(res, { galleryPages });
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
}

async function getAboutPages(req: Request, res: Response) {
  const { contentType } = req.params;
  try {
    if (contentType.toUpperCase() in ContentType) {
      const aboutPages = await contentService.getContentPages(
        contentType.toUpperCase() as ContentType
      );
      return mutationSuccessResponse(res, { ...aboutPages });
    }
    return badRequestResponse(res, "Cannot find content type!");
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
}

export default {
  modifyAboutPages,
  getAboutPages,
  modifyGalleryPages,
  deleteImageGallery,
};
