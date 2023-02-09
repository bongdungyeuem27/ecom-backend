import { User, IUser } from "~models/User.js";
import jwt from "jsonwebtoken";

export const generateAccessToken = (user: IUser) => {
  return jwt.sign(
    { _id: user._id, username: user.username },
    process.env.JWT_ACCESS_KEY,
    { expiresIn: "1d" }
  );
};
export const generateRefreshToken = (user: IUser) => {
  return jwt.sign(
    { _id: user._id, username: user.username },
    process.env.JWT_REFRESH_KEY,
    { expiresIn: "365d" }
  );
};
