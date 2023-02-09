
import express from "express";
import product from "./product";
import auth from "./auth";


const routers = express.Router();

routers.use("/product", product);
routers.use("/auth", auth);

export default routers;
