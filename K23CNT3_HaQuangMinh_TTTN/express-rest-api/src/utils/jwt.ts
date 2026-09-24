import jwt from "jsonwebtoken";

export const generateAccessToken = (user: any) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      type: "access",
    },
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || "15m") as any,
    }
  );
};

export const generateRefreshToken = (user: any) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      type: "refresh",
    },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as any,
    }
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET as string
  );
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string
  );
};
