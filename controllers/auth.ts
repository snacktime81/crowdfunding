import {RequestHandler, Request, Response, NextFunction} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { RowDataPacket, FieldPacket } from "mysql2/promise";
import pool from "../models/db";

import {user} from "../types/model"

dotenv.config();

const postUser: RequestHandler = async(req: Request, res: Response, next: NextFunction) => {
	try{
		const {nick, email, password, age} = req.body;
		
		let query = "SELECT id FROM USER WHERE email = (?)";
		let data = [email];

		const [rows, fields] : [user[], FieldPacket[]] = await pool.query(query, data);
		const exUser = rows[0];

		if(exUser){
			return res.send(
				  `<script>
					alert('이미 존재하는 email입니다.');
					location.href='/login';
				  </script>`
				);
		}
		const hash = await bcrypt.hash(password, 12);
		
		query = "INSERT INTO USER (email, name, password) VALUES (?, ?, ?)";
		data = [email, nick, hash];
		
		await pool.query(query, data);

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

		let query = "SELECT * FROM USER WHERE email = (?)";
		let data = [email]

		const [rows, fields] : [user[], FieldPacket[]] = await pool.query(query, data);
		const exUser = rows[0];
		// console.log('exUser: ', exUser);
		// console.log('rows: ', rows);
		// console.log('fields: ', fields);

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

		let query = "SELECT id FROM USER WHERE id = (?)";
		let dataId = [data.id]

		const [rows, fields] : [user[], FieldPacket[]] = await pool.query(query, data);
		const exUser = rows[0];
		
		if (rows.length != 0) {
			res.status(200);
			next();
		}
		
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

		let query = "SELECT id FROM USER WHERE id = (?)";
		let dataId = [data.id]

		const [rows, fields] : [user[], FieldPacket[]] = await pool.query(query, dataId);
		const exUser = rows[0];
		console.log(rows);
		
		if (rows.length != 0) {
			next();
		}

	}
	catch(err){
		console.log(2);
		res.redirect('/');
	}
}

const isNotLoggedIn: RequestHandler = async(req: Request, res: Response, next:NextFunction) => {
	try{
		const accessToken: string = req.cookies.accessToken;
		const data: any = jwt.verify(accessToken, process.env.ACCESS_SECRET || '');

		let query = "SELECT id FROM USER WHERE id = (?)";
		let dataId = [data.id]

		const [rows, fields] : [user[], FieldPacket[]] = await pool.query(query, data);
		const exUser = rows[0];
		if(rows.length != 0){
			next('route');
		}
	}
	catch(err){
		next();
	}
}



export {postUser, postLogin, loginAuth, isLoggedIn, isNotLoggedIn, refreshToken};