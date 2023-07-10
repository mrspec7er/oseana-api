import { PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

interface CartType {
id?:             number
  name:        string
  destination  :  string
  description? :   string
  include?:      string
  destinationURL?: string
  price :         number
}

async function create({name, destination, price, description, destinationURL, include}: CartType) {
    return await prisma.ticket.create({
        data: {
            name,
            destination,
            price,
            description,
            destinationURL,
            include
        }
    })

}

async function update({id, name, destination, price, description, destinationURL, include}: CartType) {
    return await prisma.ticket.update({
        data: {
            name,
            destination,
            price,
            description,
            destinationURL,
            include
        },
        where: {
            id
        }
    })

}



    async function deleteOne(id: number) {

    return await prisma.ticket.delete({

        where: {
            id
        }
    })
}

async function getAll() {
    return await prisma.content.findMany();
}
export default {create, update, deleteOne, getAll }