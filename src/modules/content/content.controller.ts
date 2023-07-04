import { Request, Response } from "express";
import { badRequestResponse, errorResponse, mutationSuccessResponse } from "../../utility/apiResponse";
import contentService from './content.service'

async function modifyAboutPages(
    req: Request,
    res: Response
) {
    const { title, body } = req.body;

    try {
        if (!title || !body) {
            return badRequestResponse(res, "Title and body undefine!")
        }

        const aboutPages = await contentService.modifyAboutPages(title, body)

        return mutationSuccessResponse(res, { ...aboutPages });
    } catch (err: any) {
        return errorResponse(res, err.message);
    }
}

async function getAboutPages(
    req: Request,
    res: Response
) {
    try {
        const aboutPages = await contentService.getAboutPages()

        return mutationSuccessResponse(res, { ...aboutPages });
    } catch (err: any) {
        return errorResponse(res, err.message);
    }
}

export default { modifyAboutPages, getAboutPages }