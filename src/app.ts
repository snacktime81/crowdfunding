import express, { ErrorRequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import nunjucks from 'nunjucks';
import methodOverride from 'method-override';
import cors from 'cors';
import { createClient } from 'redis';

dotenv.config();
import pageRouter from '../routes/page';
import authRouter from '../routes/auth';
import itemRouter from '../routes/item';
import qAndARouter from '../routes/qAndA';
import { CustomError } from '../types';
import { NoMatchId } from '../types/error';
import { TokenExpiredError } from 'jsonwebtoken';

const app = express();
app.set('port', process.env.PORT || 8000);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html'); 
nunjucks.configure('views', { 
  express: app,
  watch: true,
});

const rootDir = path.join(__dirname, '..');

if(process.env.NODE_ENV !== 'test'){
	app.use(morgan('dev'));
}
app.use(express.static(path.join(rootDir, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(methodOverride('_method'));
app.use(cors());

const redisClient = createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  legacyMode: true,
});
redisClient.on('connect', () => {
  console.info('Redis connected');
});
redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});
redisClient.connect().then();
const redisCli = redisClient.v4;


app.use('/auth', authRouter);
app.use('/item', itemRouter);
app.use('/qAndA', qAndARouter)
app.use('/', pageRouter);

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const error: CustomError = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

const errorHandler: ErrorRequestHandler = (err, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if(err instanceof NoMatchId){
    res.send(`<script> alert("${err.message}"); location.href='/'; </script>`)
  } else if(err instanceof TokenExpiredError){
    console.log('jwt refresh');
  }
  else{
    console.error(err);
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
  }
};
app.use(errorHandler);

export {app, redisCli}