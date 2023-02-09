import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Token } from '~models/Token';
import { IUser } from '~models/User.js';

export async function verifyAccessToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json('you must be logged in');
    res.end();
    return;
  }

  const accessToken = token.split(' ')[1];
  jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (error, user) => {
    if (error) {
      res.status(403).json('token is invalid');
      res.end();
    }
    res.locals.user = user;
    next();
  });
}
export async function verifyRefreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json('you are not authenticated');
    }
    const sourceToken = await Token.findOne({ data: refreshToken }).exec();
    if (sourceToken) {
      throw Error('sourceToken not found');
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (error, user: IUser) => {
      if (error) {
        return new Error(error);
      }
      res.locals.user = user;
      Token.deleteOne({ data: refreshToken });
      next();
    });
  } catch (error) {
    console.error(error);
    res.status(401).json(error);
    res.end();
  }
}
