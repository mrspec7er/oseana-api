import { Response } from "express";
function badRequestResponse(res: Response, message: string) {
  return res.status(400).send({
    status: false,
    message,
  });
}

function unauthorizeResponse(res: Response) {
  return res.status(401).send({
    status: false,
    message: "Unauthorize user",
  });
}

function loginRedirectResponse(res: Response) {
  return res.status(403).send({
    status: false,
    message: "Token expired",
  });
}

function notAllowedResponse(res: Response) {
  return res.status(405).send({
    status: false,
    message: "Request not allowed",
  });
}

function errorResponse(res: Response, message: string) {
  return res.status(500).send({
    status: false,
    message,
  });
}

function mutationSuccessResponse(res: Response, data: any) {
  res.status(201).send({
    status: true,
    data,
  });
}

function getSuccessResponse(res: Response, data: any, meta?: any) {
  res.status(200).send({
    status: true,
    data,
    meta,
  });
}

export {
  getSuccessResponse,
  mutationSuccessResponse,
  errorResponse,
  loginRedirectResponse,
  notAllowedResponse,
  unauthorizeResponse,
  badRequestResponse,
};