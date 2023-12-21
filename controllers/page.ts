import {RequestHandler, Request, Response, NextFunction} from 'express';
import {FieldPacket} from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import pool from "../models/db";
import { item } from '../types/model';
import {payload} from "../types/model";
import {verify, isExpired, getUserToToken} from '../func/token';

dotenv.config();


const renderMainNotLoggedIn: RequestHandler = async(req: Request, res: Response) => {
	const query = "SELECT * FROM ITEM ORDER BY views DESC LIMIT 3";
	const [items, fields]: [item[], FieldPacket[]] = await pool.query(query);

	res.status(200).render('index', {loginState: false, items: items});	
};

const renderMainLoggedIn: RequestHandler = async(req: Request, res: Response) => {
	const query = "SELECT * FROM ITEM ORDER BY views DESC LIMIT 3";
	const [items, fields]: [item[], FieldPacket[]] = await pool.query(query);
	
	res.status(200).render('index', {loginState: true, items: items});	
};

const renderHome: RequestHandler = async(req, res) => {
	try{
		const query = "SELECT * FROM ITEM ORDER BY views DESC LIMIT 3";
		const [items, fields]: [item[], FieldPacket[]] = await pool.query(query);

		const accessToken: string = req.cookies.accessToken;
		const refreshToken: string = req.cookies.refreshToken;

		const accessSecret = process.env.ACCESS_SECRET || '';
		const refreshSecret = process.env.REFRESH_SECRET ||'';
		let data : {loginState: boolean, items: item[]};
		if(accessToken === undefined){ // undefined즉 accessToken이 존재하지 않을때
			data = {loginState: false, items: items};
		}

		const accessData : payload | 'expired' = verify(accessToken, accessSecret) as payload | 'expired';
		const refreshData : payload | 'expired' = verify(refreshToken, refreshSecret) as payload | 'expired';

		if(isExpired(accessData)){ // accessToken이 만료 되었을 때
			if(isExpired(refreshData)){ // refreshToken 또한 만료 되었을 떄
				data = {loginState: false, items: items};	
			}
			else{ // refreshToken으로 accessToken 재발급
				const accessToken: string = jwt.sign({
					id: refreshData.id,
					email: refreshData.email,
					name: refreshData.name,
				}, accessSecret, {
					expiresIn: '1m',
				});
				res.cookie('accessToken', accessToken, {
					secure: false,
					httpOnly: true,
				});
				data = {loginState: true, items: items};
			}
		}
		else{ // accessToken이 남아있을떄
			if(isExpired(refreshData)){ // refreshToken이 만료되었을 때
				data = {loginState: false, items: items};				
			}
			else{ // 로그인이 되어있는 상태
				data = {loginState: true, items: items};
			}
		}
		res.status(200).render('index', data);
	}
	catch(err){
		res.status(500);
		console.log('tokenCheck error');
		const error = new Error(err as string);
		throw(error);
	}
}

const renderLogin: RequestHandler = (req : Request, res: Response) => {
	res.status(200).render('login');
}

const renderJoin: RequestHandler = (req : Request, res: Response) => {
	res.status(200).render('join');
}

const logout: RequestHandler = (req, res) => {
	try{
		res.cookie('accessToken', '');
		res.cookie('refreshToken', '');
		res.status(200).redirect('/');
	}
	catch(err){
		res.status(500);
	}
}

const renderProfile: RequestHandler = async(req, res) => {
	try{
		const accessToken: string = req.cookies.accessToken;
		const user = await getUserToToken(accessToken);
		res.status(302).render('profile', {user: user});
	}
	catch(err){
		throw(err);
	}
}

const renderUser: RequestHandler = async(req, res) => {
	try{
		const accessToken: string = req.cookies.accessToken;
		const user = await getUserToToken(accessToken);
		res.status(302).render('user', {user: user})
	}
	catch(err){
		res.status(500);
	}
}

export {renderMainNotLoggedIn, renderMainLoggedIn, renderLogin, renderJoin, logout, renderProfile, renderUser, renderHome};