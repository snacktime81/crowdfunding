import {RequestHandler, Request, Response, NextFunction} from 'express';
import pool from "../models/db";
import { item } from '../types/model';
import {FieldPacket} from 'mysql2/promise';
import jwt from 'jsonwebtoken';

import {user, payload} from "../types/model";


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

const getUserToToken: (arg: string) => Promise<user> = async(accessToken) => {
	const data: payload = jwt.verify(accessToken, process.env.ACCESS_SECRET || '') as payload;

	let query = "SELECT * FROM USER WHERE id = (?)";
	let dataId = [data.id]

	const [rows, fields] : [user[], FieldPacket[]] = await pool.query(query, dataId);
	const exUser: user = rows[0];
	
	return exUser
}

const renderProfile: RequestHandler = async(req, res) => {
	try{
		const accessToken: string = req.cookies.accessToken;
		const user = await getUserToToken(accessToken);
		console.log(user)
		res.status(302).render('profile');
	}
	catch(err){
		res.status(500);
	}
}

export {renderMainNotLoggedIn, renderMainLoggedIn, renderLogin, renderJoin, logout, renderProfile};