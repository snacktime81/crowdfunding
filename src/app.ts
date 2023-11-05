import express, { ErrorRequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import nunjucks from 'nunjucks';
import { CustomError } from '../types';

dotenv.config();
import pageRouter from '../routes/page';
import authRouter from '../routes/auth';
import itemRouter from '../routes/item';
import qAndARouter from '../routes/qAndA';
import {loginAuth} from '../controllers/auth';

const app = express();
app.set('port', process.env.PORT || 8000);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html'); 
nunjucks.configure('views', { 
  express: app,
  watch: true,
});

const rootDir = path.join(__dirname, '..');
app.use(morgan('dev'));
app.use(express.static(path.join(rootDir, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));



app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/item', itemRouter);
app.use('/qAndA', qAndARouter)

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const error: CustomError = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});


const errorHandler: ErrorRequestHandler = (err: CustomError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
};
app.use(errorHandler);



app.listen(app.get('port'), () => {
	console.log(app.get('port'), '번 포트에서 대기중');

});