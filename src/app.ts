import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import * as fs from 'fs';
import { createServer } from 'http';
import morgan from 'morgan';
import { AddressInfo } from 'net';
import * as path from 'path';
import * as util from 'util';
import { mongoServer } from './configs';
import routers from './routes/index';
import redis from "redis";
import cookies from "cookie-parser";

dotenv.config();

const logFile = fs.createWriteStream(path.join('./debug.log'), { flags: 'a' });
const logStdout = process.stdout;

console.log = function (d) {
  logFile.write(`${new Date().toISOString()} ${util.format.apply(null, arguments)} \n`);
  new this.Console(logStdout).log(d);
};

console.error = (d) => {
  console.log(d);
};

const accessLogStream = fs.createWriteStream(path.join('access.log'), {
  flags: 'a',
});
var app = express();

app.use(cors());

app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.json()); //cho phep json
app.use(bodyParser.urlencoded({ extended: true })); //Cho phep form

//session
app.set('trust proxy', 1); // trust first proxy
// app.use(
//   session({
//     secret: config.get("secret_key"),
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true },
//   })
// );
app.use(cookies());

//static folder
app.use('/public', express.static('./public'));

// redis

const redisClient = redis.createClient({ url: process.env.REDIS_URI });
await redisClient.connect();
app.locals.redis = redisClient;

// mongo
mongoServer();

app.use(routers);

export const server = createServer(app);

server.listen({ port: process.env.PORT || 4000 }, () => {
  const { address, port } = server.address() as AddressInfo;
  console.log(`Example app listening at http://${address}:${port}`);
});
