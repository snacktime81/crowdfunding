import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
import pageRouter from '../routes/page';

const app = express();
app.set('port', process.env.PORT || 8000);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(morgan('dev'));
app.use(express.static(path.join('/workspace/crowdfunding', "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));


app.use('/', pageRouter);

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  next(error);
});

const errorHandler = (err: Error, req:express.Request, res:express.Response, next: express.NextFunction) => {
  console.error(err);
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.render('error');
};
app.use(errorHandler);

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});