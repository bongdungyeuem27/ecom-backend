import express from "express";
import {
  login,
  refresh,
  register,
  testVerifyAccessToken,
} from "~controllers/auth/index.js";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "~middlewares/auth/index.js";
import { auto, logout, verifyOTP } from "./../../controllers/auth/index.js";

const routers = express.Router();

routers.post("/register", register);
routers.post("/login", login);  
routers.get("/testverifyaccesstoken", verifyAccessToken, testVerifyAccessToken);
routers.get("/refresh", verifyRefreshToken, refresh);
routers.post("/auto", verifyRefreshToken, auto);
routers.post("/logout", logout);
routers.post("/verifyotp", verifyOTP);  

export default routers;
