import {RequestHandler, Request, Response, NextFunction} from 'express';
import pool from "../models/db";
import { item } from '../types/model';
import {FieldPacket} from 'mysql2/promise';

const renderMainNotLoggedIn: RequestHandler = async(req: Request, res: Response) => {
	const query = "SELECT * FROM ITEM ORDER BY views DESC LIMIT 3";
	const [items, fields]: [item[], FieldPacket[]] = await pool.query(query);

	res.render('index', {loginState: false, items: items});	
};

const renderMainLoggedIn: RequestHandler = async(req: Request, res: Response) => {
	const query = "SELECT * FROM ITEM ORDER BY views DESC LIMIT 3";
	const [items, fields]: [item[], FieldPacket[]] = await pool.query(query);
	
	res.render('index', {loginState: true, items: items});	
};

const renderLogin: RequestHandler = (req : Request, res: Response) => {
	res.render('login');
}

const renderJoin: RequestHandler = (req : Request, res: Response) => {
	res.render('join');
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

export {renderMainNotLoggedIn, renderMainLoggedIn, renderLogin, renderJoin, logout,};