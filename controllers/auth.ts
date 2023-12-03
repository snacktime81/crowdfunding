import {RequestHandler, Request, Response, NextFunction} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { FieldPacket } from "mysql2/promise";
import pool from "../models/db";

import {user, payload, reqBody} from "../types/model";
import { CustomError } from '../types';

dotenv.config();


const postUser: RequestHandler = async(req: Request, res: Response, next: NextFunction) => {
	try{
		const {name, email, password}: reqBody = req.body;
		let query = "SELECT id FROM USER WHERE email = (?)";
		let data = [email];

		const [rows, fields] : [user[], FieldPacket[]] = await pool.query(query, data);
		const exUser = rows[0];

		if(exUser){
			res.status(409);
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
		
		res.status(200);
		return res.redirect('/');
	}
	catch(err){
		res.status(500)
		console.error(err);
		return next(err);
	}
}

const putUser: RequestHandler = async(req, res) => {
	try{
		const {name, email, password}: reqBody = req.body;
		const hash = await bcrypt.hash(password, 12);

		const id = req.params.id

		const query = "UPDATE USER SET name = (?), email = (?), password = (?) WHERE ID = (?)";
		const data = [name, email, hash, id];

		await pool.query(query, data);
		res.redirect(200, `/${id}`)
	}
	catch(err){
		res.status(500)
		console.log(err)
	}
}

const deleteUser: RequestHandler = async(req, res) => { 
	try{
		const body = req.body;
		const password = body.password;
	
		const hash = await bcrypt.hash(password, 12)
		const id = req.params.id
		const data = [id]
		let query = "SELECT * FROM USER WHERE ID = ?";

		const [rows, fields] : [user[], FieldPacket[]] = await(pool.query(query, data));
		const origianlPw = rows[0].password
		console.log(hash, origianlPw)
		if(hash === origianlPw){
			query = "DELETE FROM USER WHERE ID = (?)";	
			await pool.query(query, data);
			res.cookie('accessToken', '');
			res.cookie('refreshToken', '');
			res.redirect(303, '/');
		} else{
			res.redirect(302, `/${id}`);
		}
	}
	catch(err){
		res.status(500)
		console.log(err)
	}
}

const postLogin: RequestHandler = async(req: Request, res: Response, next: NextFunction) => {
	try{
		
		const {email, password}: Omit<reqBody, 'name'> = req.body;

		let query = "SELECT * FROM USER WHERE email = (?)";
		let data = [email];

		const [rows, fields] : [user[], FieldPacket[]] = await pool.query(query, data);
		const exUser = rows[0];
		//console.log('exuer', exUser)

		if(!exUser){
			res.status(409);
			return res.send(
				  `<script>
					alert('없는 계정입니다.');
					location.href='/login';  
				  </script>`
				);
		}
		
		if(bcrypt.compareSync(password, exUser.password)){
			
			const accessSecret: string = process.env.ACCESS_SECRET || " ";

			const accessToken: string = jwt.sign({
				id: exUser.id,
				email: exUser.email,
				name : exUser.name,
			}, accessSecret, {
				expiresIn: '1m',
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

			res.status(200);
			res.redirect('/');
		} else{
			res.status(409);
			return res.send(
				  `<script>
					alert('비밀번호가 잘못되었습니다.');
					location.href='/login';  
				  </script>`
				);
		}
	}
	catch(err){
		res.status(500);
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

const verify = (token: string, secret: string) => {
    try{    
		const data: payload = jwt.verify(token, secret) as payload;
		return data;
    }
	catch(err){
			return 'expired';
    }
}

const isExpired = (data: payload | 'expired'): data is 'expired' => {
	return data === 'expired';
}

const tokenCheck: RequestHandler = (req, res, next) => {
	try{
		const accessToken: string = req.cookies.accessToken;
		const refreshToken: string = req.cookies.refreshToken;

		const accessSecret = process.env.ACCESS_SECRET || '';
		const refreshSecret = process.env.REFRESH_SECRET ||'';

		if(accessToken === undefined){ // undefined즉 accessToken이 존재하지 않을때
			res.status(401);
			return res.send("<script>alert('로그인이 필요한 페이지 입니다.');location.href='/login';</script>");
		}

		const accessData : payload | 'expired' = verify(accessToken, accessSecret) as payload | 'expired';
		const refreshData : payload | 'expired' = verify(refreshToken, refreshSecret) as payload | 'expired';

		if(isExpired(accessData)){ // accessToken이 만료 되었을 때
			if(isExpired(refreshData)){ // refreshToken 또한 만료 되었을 떄
				res.status(401);
				res.status(500).send("<script>alert('로그인이 필요한 페이지 입니다.');location.href='/login';</script>");
			}
			else{ // refreshToken으로 accessToken 재발급
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
				res.status(200);
				next()
			}
		}
		else{ // accessToken이 남아있을떄
			if(isExpired(refreshData)){ // refreshToken이 만료되었을 때
				res.status(401);
				res.status(500).send("<script>alert('로그인이 필요한 페이지 입니다.');location.href='/login';</script>");
			}
			else{ // 로그인이 되어있는 상태
				next()
			}
		}
	}
	catch(err){
		res.status(500);
		const error = new Error(err as string);
		next(error);
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
		res.status(409).send("<script>alert('로그인이 필요한 페이지 입니다.');location.href='/login';</script>");
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
		next(err);
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

export {postUser, postLogin, loginAuth, isLoggedIn, isNotLoggedIn, refreshToken, tokenCheck, putUser, deleteUser};