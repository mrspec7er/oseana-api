import { PrismaClient, CartStatus } from "@prisma/client";
import {
  bookingStatusEmailTemplate,
  sendEmail,
} from "../../utility/emailService";

const prisma = new PrismaClient();

export interface CartType {
  id?: number;
  identity?: string;
  name?: string;
  email: string;
  phone?: string;
  date: Date;
  quantity: number;
  status?: CartStatus;
  bookingId?: string;
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
        bookingId: "OSN-" + Math.floor(Math.random() * 100000000),
        name,
        identity,
        email,
        phone,
        date: new Date(date),
        quantity,
        ticketId,
        userId,
        status: "PENDING",
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

async function updateStatus({
  id,
  status,
}: {
  id: number;
  status: CartStatus;
}) {
  const updatedCart = await prisma.cart.update({
    data: {
      status,
    },
    where: {
      id,
    },
  });

  if (updatedCart) {
    await sendEmail({
      from: "info@oseanasnorkelingadventure.com",
      subject: "Booking Informations",
      to: "wijayakusumasandi@gmail.com",
      html: bookingStatusEmailTemplate(updatedCart),
    });

    return updatedCart;
  }

  return { message: "Failed to update booking status" };
}

async function deleteOne(id: number) {
  return await prisma.cart.delete({
    where: {
      id,
    },
  });
}

async function getAll(
  status: CartStatus | null,
  keyword: string,
  limit: number,
  pageNumber: number
) {
  const query: { OR: any[]; status?: CartStatus } = {
    OR: [
      {
        name: {
          contains: keyword,
          mode: "insensitive",
        },
      },
      {
        bookingId: {
          contains: keyword,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: keyword,
          mode: "insensitive",
        },
      },
    ],
  };

  if (status) {
    query.status = status;
  }

  const data = await prisma.cart.findMany({
    where: query,
    include: {
      Ticket: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (pageNumber - 1) * limit,
    take: limit,
  });

  const totalData = await prisma.cart.count({
    where: query,
  });

  return { data, totalData };
}

async function getStatistic() {
  const totalOrder = await prisma.cart.count();
  const pendingOrder = await prisma.cart.count({
    where: {
      status: "PENDING",
    },
  });
  const completedOrder = await prisma.cart.count({
    where: {
      status: "DONE",
    },
  });

  return { totalOrder, pendingOrder, completedOrder };
}

async function getOne(bookingId: string, userCredentials: string) {
  return await prisma.cart.findFirst({
    where: {
      bookingId,
      phone: userCredentials,
    },
    include: {
      Ticket: true,
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

export default {
  create,
  update,
  updateStatus,
  deleteOne,
  getAll,
  getStatistic,
  getOne,
};
