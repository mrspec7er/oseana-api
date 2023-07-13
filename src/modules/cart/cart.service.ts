import { PrismaClient, CartStatus } from "@prisma/client";

const prisma = new PrismaClient();

interface CartType {
  id?: number;
  identity?: string;
  name?: string;
  email: string;
  phone?: string;
  date: Date;
  quantity: number;
  status?: CartStatus;
  ticketId: number;
  userId: number;
}

async function create({
  name,
  identity,
  email,
  phone,
  date,
  quantity,
  ticketId,
  userId,
}: CartType) {
  const validateInput = await validateUserAndTicket(userId, ticketId);

  if (!validateInput) {
    return { message: "cannot find user or ticket" };
  }

  try {
    const cart = await prisma.cart.create({
      data: {
        name,
        identity,
        email,
        phone,
        date: new Date(date),
        quantity,
        ticketId,
        userId,
      },
    });
    return { ...cart };
  } catch (err: any) {
    console.log(err);
    return { message: err.message };
  }
}

async function update({
  id,
  name,
  identity,
  email,
  phone,
  date,
  quantity,
  status,
}: CartType) {
  return await prisma.cart.update({
    data: {
      name,
      identity,
      email,
      phone,
      date,
      quantity,
      status,
    },
    where: {
      id,
    },
  });
}

async function deleteOne(id: number) {
  return await prisma.cart.delete({
    where: {
      id,
    },
  });
}

async function getAll() {
  return await prisma.cart.findMany();
}

async function getOne(id: number) {
  return await prisma.cart.findUnique({
    where: {
      id,
    },
  });
}

async function validateUserAndTicket(userId: number, ticketId: number) {
  const validateUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  const validateTicket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });

  if (!validateUser || !validateTicket) {
    return false;
  }

  return true;
}

export default { create, update, deleteOne, getAll, getOne };
