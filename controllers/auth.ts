import {RequestHandler, Request, Response, NextFunction} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { FieldPacket } from "mysql2/promise";
import pool from "../models/db";

import {user} from "../types/model";
import { CustomError } from '../types';

dotenv.config();

interface reqBody{
	name: string;
	email: string;
	password: string;
}

interface payload extends jwt.JwtPayload{
	id: number,
	email: string,
	name: string
}

const postUser: RequestHandler = async(req: Request, res: Response, next: NextFunction) => {
	try{
		
		
		const {name, email, password}: reqBody = req.body;
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
		data = [email, name, hash];
		
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
		
		const {email, password}: Omit<reqBody, 'name'> = req.body;

		let query = "SELECT * FROM USER WHERE email = (?)";
		let data = [email]

		const [rows, fields] : [user[], FieldPacket[]] = await pool.query(query, data);
		const exUser = rows[0];
		//console.log('exuer', exUser)

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
			name : exUser.name,
		}, accessSecret, {
			expiresIn: '5m',
		});
		
		const refreshSecret: string = process.env.REFRESH_SECRET || " ";
		
		const refreshToken: string = jwt.sign({
			id: exUser.id,
			email: exUser.email,
			name: exUser.name,
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
		const data: jwt.JwtPayload = jwt.verify(refreshToken, process.env.REFRESH_SECRET || '') as jwt.JwtPayload;

		//console.log('data', data)
		
		const accessSecret: string = process.env.ACCESS_SECRET || " ";
		
		const accessToken: string = jwt.sign({
			id: data.id,
			email: data.email,
			name: data.name,
		}, accessSecret, {
			expiresIn: '5m',
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

const tokenCheck: RequestHandler = (req, res, next) => {
	try{
		const accessToken: string = req.cookies.accessToken;
		const refreshToken: string = req.cookies.refreshToken;

		const accessSecret = process.env.ACCESS_SECRET || '';
		const refreshSecret = process.env.REFRESH_SECRET ||'';	

		if(accessToken === undefined){ // undefined즉 accessToken이 존재하지 않을때 만료와 다르다
			const error: CustomError = new Error(`로그인이 필요한 페이지 입니다.`);
			next(error);
		}

		const accessData : payload = jwt.verify(accessToken, accessSecret) as payload;

		try{ // accessToken은 정상 refreshToken 정상
			const refreshData : payload = jwt.verify(refreshToken, refreshSecret) as payload;
			next()
		}
		catch(err2){// accessTken은 정상 refreshToken은 만료 또는 위조
			const refreshToken: string = jwt.sign({
				id: accessData.id,
				email: accessData.email,
				name: accessData.name,
			}, accessSecret, {
				expiresIn: '300m',
			});
			
			res.cookie('refreshToken', refreshToken, {
				secure: false,
				httpOnly: true,
			});
			next()
		}
	
	}
	catch(err){ // accessToken에서 문제 발생
		try{
			const refreshToken: string = req.cookies.refreshToken;

			const refreshSecret = process.env.REFRESH_SECRET ||'';
			const accessSecret = process.env.ACCESS_SECRET || '';

			const refreshData : payload = jwt.verify(refreshToken, refreshSecret) as payload;

			const accessToken: string = jwt.sign({
				id: refreshData.id,
				email: refreshData.email,
				name: refreshData.name,
			}, accessSecret, {
				expiresIn: '5m',
			});
			
			res.cookie('accessToken', accessToken, {
				secure: false,
				httpOnly: true,
			});
			next()

		}
		catch(err3){ // accessToken, refreshToken 둘 다 만료 또는 위조
			const error: CustomError = new Error(`로그인이 필요한 페이지 입니다.`);
			next(error);
		}
	}
}

const loginAuth: RequestHandler = async(req: Request, res: Response, next: NextFunction) => {
	try{
		const accessToken: string = req.cookies.accessToken;
		const data: any = jwt.verify(accessToken, process.env.ACCESS_SECRET || '');

		let query = "SELECT id FROM USER WHERE id = (?)";
		let dataId = [data.id]

		const [rows, fields] : [user[], FieldPacket[]] = await pool.query(query, dataId);
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
		
		if (rows.length != 0) {
			next();
		}
		else{
			const url = req.originalUrl
			res.redirect(`${url}`);
		}

	}
	catch(err){
		const url = req.originalUrl
		res.redirect(`${url}`);
	}
}

const isNotLoggedIn: RequestHandler = async(req: Request, res: Response, next:NextFunction) => {
	try{
		const accessToken: string = req.cookies.accessToken;
		const data: any = jwt.verify(accessToken, process.env.ACCESS_SECRET || '');

		let query = "SELECT id FROM USER WHERE id = (?)";
		let dataId = [data.id]

		const [rows, fields] : [user[], FieldPacket[]] = await pool.query(query, dataId);
		const exUser = rows[0];
		if(rows.length != 0){
			next('route');
		}
		else{
			next();
		}
	}
	catch(err){
		next();
	}
}



export {postUser, postLogin, loginAuth, isLoggedIn, isNotLoggedIn, refreshToken, tokenCheck};