import { NextFunction, Request, Response } from "express";
import { createDecoder } from "fast-jwt";
import { PrismaClient, Role } from "@prisma/client";
import {
  loginRedirectResponse,
  unauthorizeResponse,
  badRequestResponse,
} from "../utility/apiResponse";

const decode = createDecoder();
const prisma = new PrismaClient();

export async function verifyUserAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
      return unauthorizeResponse(res);
    }

    const payload = decode(accessToken);

    if (payload.exp < new Date().getTime() / 1000) {
      return loginRedirectResponse(res);
    }

    if (!payload.email) {
      return unauthorizeResponse(res);
    }

    const user = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!user || user.role !== Role.USER) {
      return unauthorizeResponse(res);
    }

    res.locals.email = user.email;
    res.locals.userId = user.id;

    next();
  } catch (err) {
    return loginRedirectResponse(res);
  }
}
