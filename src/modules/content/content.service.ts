import { PrismaClient, ContentType } from "@prisma/client";
import fs from 'fs'

const prisma = new PrismaClient();

async function modifyAboutPages(title: string, body: string) {
    return await prisma.content.upsert({
        create: {
            body,
            title,
            type: "ABOUT"
        },
        update: {
            body,
            title,
        },
        where: {
            type: "ABOUT"
        }
    })

}


async function modifyGalleryPages(title: string, images: Express.Multer.File[]) {

    const imagesURL = images.map(i => i.path);
    const currentImages = (await prisma.content.findUnique({
        where: {
            type: "GALLERY"
        }
    }))?.images
    
    return await prisma.content.upsert({
        create: {
            title,
            type: "GALLERY",
            images: imagesURL
        },
        update: {
            title,
            images: currentImages ? [...currentImages!, ...imagesURL] : imagesURL,
        },
        where: {
            type: "GALLERY"
        }
    })

}

async function deleteImageGallery(imageURL: string) {
    const currentImages = (await prisma.content.findUnique({
        where: {
            type: "GALLERY"
        }
    }))?.images

    const newImageList = currentImages?.filter(i => i !== imageURL);

    fs.unlinkSync(imageURL)

    return await prisma.content.update({
        data: {
            images: newImageList
        },
        where: {
            type: "GALLERY"
        }
    })
}

async function getContentPages(contentType: ContentType) {
    return await prisma.content.findUnique({
        where: {
            type: contentType
        }
    });
}
export default { modifyAboutPages, modifyGalleryPages, getContentPages, deleteImageGallery }