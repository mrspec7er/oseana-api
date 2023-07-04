import { PrismaClient } from "@prisma/client";

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

async function getAboutPages() {
    return await prisma.content.findUnique({
        where: {
            type: "ABOUT"
        }
    })
}

export default { modifyAboutPages, getAboutPages }