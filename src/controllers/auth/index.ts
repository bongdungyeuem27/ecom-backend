import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import type { RedisClientType } from 'redis';
import { Token } from '~models/Token';
import { User } from '~models/User';
import { generateAccessToken, generateRefreshToken } from './utils';

export const register = async (req: Request, res: Response) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const phone = req.body.phone;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashed,
      phone,
      active: false,
    });
    const user = await newUser.save();
    user.password = undefined;
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await new Token({ data: refreshToken }).save();
    const otp = Math.floor(1000 + Math.random() * 9000);
    const redis = req.app.locals.redis;
    await redis.set(username, otp, {
      EX: 60 * 15,
      NX: true,
    });

    res.status(200).json({ otp, user, accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
  res.end();
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const username = req.body.username as string;
    const otp = req.body.otp;
    const redis: RedisClientType = req.app.locals.redis;
    const verifyOTP = await redis.get(username);
    if (otp != verifyOTP) res.status(403).json('not match');
    const user = await User.findOne({ username: username });
    if (!user.active) {
      await Promise.all([
        User.updateOne({ username: username }, { active: true }),
        redis.del(username),
      ]);
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
  res.end();
};

export const login = async (req: Request, res: Response) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({ username: username });
    const validPassword = await bcrypt.compare(password, user.password);
    user.password = undefined;
    if (!validPassword) {
      res.status(400).json('wrong password');
    }
    if (user && validPassword) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'strict',
      });
      await new Token({ data: refreshToken }).save();
      res.status(200).json({ user, accessToken });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
  res.end();
};

export const testVerifyAccessToken = (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
  res.end();
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
     new Token({ data: newRefreshToken }).save();
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'strict',
    });
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
  res.end();
};

export const auto = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    new Token({ data: newRefreshToken }).save();
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'strict',
    });
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
  res.end();
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    Token.deleteOne({ data: refreshToken });
    res.status(200).json('success');
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
  res.end();
};
