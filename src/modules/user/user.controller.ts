import {
  badRequestResponse,
  errorResponse,
  getSuccessResponse,
  notAllowedResponse,
  mutationSuccessResponse,
} from "../../utility/apiResponse";
import { Request, Response } from "express";
import userServices from "./user.service";

async function createUser(req: Request, res: Response) {
  const { name, email, password, phone } = req.body;

  try {
    if (!email || !password) {
      return badRequestResponse(res, "Email and password required");
    }

    const user = await userServices.createUser({
      email,
      name,
      password,
      phone,
    });

    return mutationSuccessResponse(res, user);
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
}

async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return badRequestResponse(res, "Email and password required");
    }

    const userCredentials = await userServices.login(email, password);

    if (userCredentials.message) {
      return badRequestResponse(res, userCredentials.message);
    }

    return mutationSuccessResponse(res, userCredentials);
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
}

async function getAccessToken(req: Request, res: Response) {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      return notAllowedResponse(res);
    }

    const accessToken = await userServices.getAccessToken(refreshToken);
    if (accessToken?.message) {
      return notAllowedResponse(res);
    }

    return mutationSuccessResponse(res, { ...accessToken });
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
}

async function sendResetPassword(req: Request, res: Response) {
  const { email } = req.body;
  try {
    const resetPassword = await userServices.sendResetPasswordLink(email);
    if (resetPassword.message) {
      badRequestResponse(res, resetPassword.message);
    }

    return resetPassword;
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
}

async function resetPassword(
  req: Request<{
    Body: { newPassword: string };
    Querystring: { resetToken: string };
  }>,
  res: Response
) {
  const { resetToken } = req.query;
  const { newPassword } = req.body;
  try {
    if (!newPassword || typeof resetToken !== "string") {
      return badRequestResponse(res, "New password field required");
    }

    const result = await userServices.resetPassword(newPassword, resetToken);
    if (result.message) {
      return notAllowedResponse(res);
    }

    return mutationSuccessResponse(res, result);
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
}

async function getAllUsers(req: Request, res: Response) {
  const { keyword, page, limit } = req.query;
  try {
    if (!page || !limit) {
      return badRequestResponse(res, "Page and limit params required!");
    }

    const users = await userServices.getAllUsers(
      Number(page),
      Number(limit),
      String(keyword)
    );

    return getSuccessResponse(res, users);
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
}

async function verifiedUserEmail(req: Request, res: Response) {
  const { token } = req.query;
  try {
    if (typeof token !== "string") {
      return badRequestResponse(res, "Undefine Token");
    }

    const verifiedUser = await userServices.verifiedEmail(token);
    if (verifiedUser?.message) {
      badRequestResponse(res, "Cannon verified user email");
    }

    return getSuccessResponse(res, verifiedUser);
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
}

export default {
  createUser,
  login,
  getAccessToken,
  sendResetPassword,
  resetPassword,
  getAllUsers,
  verifiedUserEmail,
};
