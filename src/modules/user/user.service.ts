import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'
import { createDecoder, createSigner } from 'fast-jwt';
import { resetPasswordEmailTemplate, sendEmail } from '../../utility/emailService';

export enum RoleType {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface UserType {
  id?: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: RoleType;
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL!;
const SMTP_USER = process.env.SMPT_USER!;
const RECOVERY_EMAIL = process.env.RECOVERY_EMAIL!;

const accessTokensignature = createSigner({
  key: ACCESS_TOKEN_SECRET,
  expiresIn: 24 * 60 * 60 * 1000,
});
const refreshTokenSignature = createSigner({
  key: REFRESH_TOKEN_SECRET,
  expiresIn: 7 * 24 * 60 * 60 * 1000,
});
const verifiedEmailSignature = createSigner({
  key: ACCESS_TOKEN_SECRET,
  expiresIn: 60 * 60 * 1000,
});

const decode = createDecoder();

async function createToken(email: string, type: "ACCESS" | "REFRESH" | "VERIFIED") {
  if (type === "ACCESS") {

    return accessTokensignature({ email });
  }

  if (type === "REFRESH") {
    return refreshTokenSignature({ email });
  }

  if (type === "VERIFIED") {
    return verifiedEmailSignature({ email });
  }
}

const prisma = new PrismaClient();

async function createUser({ email, name, password, phone }: UserType) {

  const encryptedPassword = await bcrypt.hash(password, 11);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      password: encryptedPassword,
      role: "USER",
      verifiedEmail: false
    },
  });

  //send email to user

  return await createToken(user.email, "VERIFIED")

}

async function verifiedEmail(token: string) {

  const payload = decode(token);

  if (payload.exp < new Date().getTime() / 1000) {
    return { message: "Token expired!" }
  }
  if (!payload.email) {
    return { message: "Failed to decode refresh token!" };
  }

  const user = await prisma.user.update({
    data: { verifiedEmail: true },
    where: {
      email: await payload.email,
    },
  });
  if (!user) {
    return { message: "Cannot find user account!" };
  }

  user.password = 'encrypted'

  return { ...user }

}

async function login(email: string, password: string) {

  const userData = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!userData) {
    return { message: "Email Undefine" };
  }

  const checkPassword = await bcrypt.compare(password, userData.password);
  if (!checkPassword) {
    return { message: "invalid Password" };
  }

  // delete userData?.password
  return {
    accessToken: await createToken(userData.email, "ACCESS"),
    refreshToken: await createToken(userData.email, "REFRESH"),
    userData
  }
}

async function getAccessToken(refreshToken: string) {

  const payload = decode(refreshToken);

  if (payload.exp < new Date().getTime() / 1000) {
    return { message: "Token expired!" }
  }
  if (!payload.email) {
    return { message: "Failed to decode refresh token!" };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: await payload.email,
    },
  });
  if (!user) {
    return { message: "Cannot find user account!" };
  }

  return { accessToken: await createToken(user.email, "ACCESS") };
}

async function getAllUsers(page: number, limit: number, keyword: string) {
  const users = await prisma.user.findMany({
    where: {
      name: {
        contains: keyword,
        mode: 'insensitive'
      },
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  users.map(i => i.password = 'encrypted')
  const totalData = await prisma.user.count({
    where: {
      name: {
        contains: keyword,
        mode: "insensitive",
      },
    },
  });


  return { users, meta: { totalData } }
}

async function sendResetPasswordLink(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return { message: "Cannot find user with email: " + email }
  }

  const accessToken = await createToken(user.email, "REFRESH");

  const resetPasswordURL =
    FRONTEND_BASE_URL + "/reset-password/" + accessToken;

  const emailBody = resetPasswordEmailTemplate("Oseana", resetPasswordURL);

  const mailOptions = {
    from: SMTP_USER!,
    to: RECOVERY_EMAIL!,
    subject: "RESET PASSWORD",
    html: emailBody,
  };

  await sendEmail(mailOptions);

  return { data: "Reset password url send to your email!" };
}

async function resetPassword(newPassword: string, resetToken: string) {

  const payload = decode(resetToken);

  if (payload.exp < new Date().getTime() / 1000) {
    return { message: "Expired reset token" }
  }

  if (!payload.email) {
    return { message: "Cannot find user credentials" }
  }
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userData) {
    return { message: "Cannot find user credentials" }
  }

  const encryptedPassword = await bcrypt.hash(newPassword, 11);
  const user = await prisma.user.update({
    data: {
      password: encryptedPassword,
    },
    where: {
      email: userData?.email,
    },
  });

  user.password = 'encrypted'

  return { ...user }
}

export default { createUser, login, getAccessToken, getAllUsers, verifiedEmail, sendResetPasswordLink, resetPassword }