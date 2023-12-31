import { Request, Response } from "express";
import {
  badRequestResponse,
  errorResponse,
  mutationSuccessResponse,
  getSuccessResponse,
} from "../../utility/apiResponse";
import cartService from "./cart.service";
import { CartStatus } from "@prisma/client";

async function create(req: Request, res: Response) {
  const { name, date, email, quantity, ticketId, userId, identity, phone } =
    req.body;

  try {
    if (!name || !email || !quantity || !ticketId) {
      return badRequestResponse(res, "Required field undefine!");
    }

    const cart = await cartService.create({
      name,
      date,
      email,
      quantity,
      ticketId,
      userId: 1,
      identity,
      phone,
    });

    if (cart?.message) {
      return badRequestResponse(res, cart.message);
    }

    return mutationSuccessResponse(res, cart);
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
}

async function update(req: Request, res: Response) {
  const {
    id,
    name,
    date,
    email,
    quantity,
    status,
    ticketId,
    userId,
    identity,
    phone,
  } = req.body;

  try {
    if (
      !id ||
      !name ||
      !email ||
      !quantity ||
      !status ||
      !ticketId ||
      !userId
    ) {
      return badRequestResponse(res, "Required field undefine!");
    }

    const cart = await cartService.update({
      id,
      name,
      date,
      email,
      quantity,
      status,
      ticketId,
      userId,
      identity,
      phone,
    });

    return mutationSuccessResponse(res, cart);
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
}

async function updateStatus(req: Request, res: Response) {
  const { id, status } = req.body;

  try {
    if (status in CartStatus) {
      const cart = await cartService.updateStatus({
        id,
        status,
      });

      return mutationSuccessResponse(res, cart);
    }
    return badRequestResponse(res, "Required field undefine!");
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
}

async function deleteOne(req: Request, res: Response) {
  const { id } = req.params;

  try {
    if (!id) {
      return badRequestResponse(res, "Required field undefine!");
    }

    const cart = await cartService.deleteOne(Number(id));

    return mutationSuccessResponse(res, cart);
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
}

async function getAll(req: Request, res: Response) {
  const { limit, pageNumber, keyword, status } = req.query;
  try {
    if (
      !limit ||
      !pageNumber ||
      typeof keyword !== "string" ||
      typeof status !== "string"
    ) {
      return badRequestResponse(res, "Required field undefine!");
    }

    if (status === "" || status in CartStatus) {
      const cart = await cartService.getAll(
        status as CartStatus,
        keyword,
        Number(limit),
        Number(pageNumber)
      );
      return getSuccessResponse(res, cart.data, { totalData: cart.totalData });
    }
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
}

async function getStatistic(req: Request, res: Response) {
  try {
    const statistic = await cartService.getStatistic();

    return mutationSuccessResponse(res, statistic);
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
}

async function getOne(req: Request, res: Response) {
  const { bookingId, userCredential } = req.params;
  try {
    const cart = await cartService.getOne(bookingId, userCredential);

    return mutationSuccessResponse(res, cart);
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
}

export default {
  create,
  deleteOne,
  update,
  getAll,
  getStatistic,
  getOne,
  updateStatus,
};
