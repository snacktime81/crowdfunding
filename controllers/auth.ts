import {RequestHandler, Request, Response, NextFunction} from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const postUser: RequestHandler = async(req: Request, res: Response, next: NextFunction) => {
	try{
		const {nick, email, password, age} = req.body;
		
		const exUser = await User.findOne({ where: { email } });
		
		if(exUser){
			return res.send(
				  `<script>
					alert('이미 존재하는 email입니다.');
					location.href='/login';
				  </script>`
				);
		}
		const hash = await bcrypt.hash(password, 12);

		await User.create({
			email,
			nick,
			password: hash,
			age,
		});
		return res.redirect('/');
	}
	catch(err){
		console.error(err);
		return next(err);
	}
}

const postLogin: RequestHandler = async(req: Request, res: Response, next: NextFunction) => {
	try{
		const {email, password} = req.body;

		const exUser = await User.findOne({where: {email: email}})

		if(!exUser){
			res.status(403);
			return res.send(
				  `<script>
					alert('없는 계정입니다.');
					location.href='/login';  
				  </script>`
				);
		}

		const accessSecret: string = process.env.ACCESS_SECRET || " ";
		
		const accessToken: string = jwt.sign({
			id: exUser.id,
			email: exUser.email,
			nick: exUser.nick,
		}, accessSecret, {
			expiresIn: '1m',
		});
		
		const refreshSecret: string = process.env.REFRESH_SECRET || " ";
		
		const refreshToken: string = jwt.sign({
			id: exUser.id,
			email: exUser.email,
			nick: exUser.nick,
		}, refreshSecret, {
			expiresIn: '300m',
		});
		
		res.cookie('accessToken', accessToken, {
			secure: false,
			httpOnly: true,
		})
		res.cookie('refreshToken', refreshToken, {
			secure: false,
			httpOnly: true,
		})
		
		res.status(200)
		res.redirect('/')
	}
	catch(err){
		console.error(err);
		return next(err);
	}
}

const refreshToken: RequestHandler = async(req: Request, res: Response, next: NextFunction) => {
	try{
		const refreshToken: string = req.cookies.refreshToken;
		const data: any = jwt.verify(refreshToken, process.env.REFRESH_SECRET || '');
		
		const accessSecret: string = process.env.ACCESS_SECRET || " ";
		
		const accessToken: string = jwt.sign({
			id: data.id,
			email: data.email,
			nick: data.nick,
		}, accessSecret, {
			expiresIn: '1m',
		});
		
		res.cookie('accessToken', accessToken, {
			secure: false,
			httpOnly: true,
		});
		
		next('route');
		
	}
	catch(err){

		next();
	}
}

const loginAuth: RequestHandler = async(req: Request, res: Response, next: NextFunction) => {
	try{
		const accessToken: string = req.cookies.accessToken;
		const data: any = jwt.verify(accessToken, process.env.ACCESS_SECRET || '');

		const user = await User.findOne( {where: {
			id: data.id,
		}} )

		res.status(200);
		next();
	}
	catch(err){
		res.status(500);
		res.send("<script>alert('로그인이 필요한 페이지 입니다.');location.href='/';</script>");
	}
}

const isLoggedIn: RequestHandler = async(req: Request, res: Response, next:NextFunction) => {
	try{
		const accessToken: string = req.cookies.accessToken;
		const data: any = jwt.verify(accessToken, process.env.ACCESS_SECRET || '');

		const user = await User.findOne( {where: {
			id: data.id,
		}} )
		next();

	}
	catch(err){
		res.redirect('/');
	}
}

const isNotLoggedIn: RequestHandler = async(req: Request, res: Response, next:NextFunction) => {
	try{
		const accessToken: string = req.cookies.accessToken;
		const data: any = jwt.verify(accessToken, process.env.ACCESS_SECRET || '');

		const user = await User.findOne( {where: {
			id: data.id,
		}} )
		next('route');
	}
	catch(err){
		next();
	}
}



export {postUser, postLogin, loginAuth, isLoggedIn, isNotLoggedIn, refreshToken};