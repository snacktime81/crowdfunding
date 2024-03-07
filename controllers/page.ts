import {RequestHandler, Request, Response, NextFunction} from 'express';
import {FieldPacket} from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import pool from "../models/db";
import { item } from '../types/model';
import {payload} from "../types/model";
import {verify, isExpired, getUserToToken, makeJwt} from '../func/token';
import { redisCli } from '../src/app';

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

		let accessToken: string = req.cookies.accessToken;

		const accessSecret = process.env.ACCESS_SECRET || '';
		const refreshSecret = process.env.REFRESH_SECRET ||'';

		let data : {loginState: boolean, items: item[]};

		if(accessToken === undefined){ // undefined즉 accessToken이 존재하지 않을때
			data = {loginState: false, items: items};
		}

		const accessData : payload | 'expired' = verify(accessToken, accessSecret) as payload | 'expired';

		if(isExpired(accessData)){ // accessToken이 만료 되었을 때
			let refreshToken: string = req.cookies.refreshToken;
			const refreshData : payload | 'expired' = verify(refreshToken, refreshSecret) as payload | 'expired';
			if (isExpired(refreshData)) {
				data = {loginState: false, items: items};
			} else{
				const tokenName: string = `refreshToken${refreshData.id}`;
				const redisRefreshToken: string = await redisCli.get(tokenName)
				if (redisRefreshToken === refreshToken){  // RTR
					data = {loginState: true, items: items};
					await redisCli.set(tokenName, redisRefreshToken);
					accessToken = makeJwt(`${refreshData.id}`, accessSecret, 18000);
					res.cookie('accessToken', accessToken, {
						secure: false,
						httpOnly: true,
					});
					refreshToken = makeJwt(`${refreshData.id}`, refreshSecret, 604800);
					res.cookie('refreshToken', refreshToken, {
						secure: true,
						httpOnly: true,
					});
					console.log('token refresh');
				} else{
					data = {loginState: false, items: items};
					res.cookie('accessToken', '')
					res.cookie('refreshToken', '')
					const tokenName: string = `refreshToken${refreshData.id}`;
					await redisCli.del(tokenName);
					res.status(409).send('<script> alert("다시 로그인해 주세요"); location.href="/login"; </script>');
				}
			}
		}
		else{ // accessToken이 남아있을떄
			data = {loginState: true, items: items};
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

const logout: RequestHandler = async(req, res) => {
	try{
		const accessToken: string = req.cookies.accessToken;
		const user: Pick<payload, 'id'> = await getUserToToken(accessToken) as Pick<payload, 'id'>;  // router에서 logout전 tokenCheck를 통해 token의 유효성 검사를 미리진행한다.
		res.cookie('accessToken', '');
		res.cookie('refreshToken', '');

		const tokenName = `refreshToken${user.id}`;
		await redisCli.del(tokenName);
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