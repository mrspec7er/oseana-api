import { Request, Response } from "express";
import {
  badRequestResponse,
  errorResponse,
  mutationSuccessResponse,
} from "../../utility/apiResponse";
import ticketService from "./ticket.service";

async function create(req: Request, res: Response) {
  const { name, destination, price, description, destinationURL, include } =
    req.body;

  try {
    if (!name || !description || !price) {
      return badRequestResponse(res, "Required field undefine!");
    }

    const ticket = await ticketService.create({
      name,
      destination,
      price,
      description,
      destinationURL,
      include,
    });

    return mutationSuccessResponse(res, ticket);
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
}

async function update(req: Request, res: Response) {
  const { id, name, destination, price, description, destinationURL, include } =
    req.body;

  try {
    if (!id || !name || !description || !price) {
      return badRequestResponse(res, "Required field undefine!");
    }

    const ticket = await ticketService.update({
      id,
      name,
      destination,
      price,
      description,
      destinationURL,
      include,
    });

    return mutationSuccessResponse(res, ticket);
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

    const ticket = await ticketService.deleteOne(Number(id));

    return mutationSuccessResponse(res, ticket);
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
}

async function getOne(req: Request, res: Response) {
  const { id } = req.params;

  try {
    if (!id) {
      return badRequestResponse(res, "Required field undefine!");
    }

    const ticket = await ticketService.getOne(Number(id));

    return mutationSuccessResponse(res, ticket);
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
}

async function getAll(req: Request, res: Response) {
  const { keyword } = req.query;
  try {
    if (typeof keyword !== "string") {
      return badRequestResponse(res, "Ticket not found!");
    }
    const ticket = await ticketService.getAll(keyword);

    return mutationSuccessResponse(res, ticket);
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
}

export default { create, deleteOne, update, getAll, getOne };
