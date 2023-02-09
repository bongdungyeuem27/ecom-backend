import { crawl, getall } from '../controllers/product';
import express from "express";


const routers = express.Router();

routers.get("/crawl", crawl);
routers.get("/all", getall)

export default routers;