import {RequestHandler, Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {FieldPacket} from 'mysql2/promise';
import { item } from '../types/model';

import pool from "../models/db";

const renderItem: RequestHandler = (req : Request, res: Response) => {
	res.render('item');
}

const postItem: RequestHandler = async(req: Request, res: Response, next: NextFunction) => {
	try{

		const {name, price, percent, deadline, image, describe} = req.body;
		let query = "INSERT INTO ITEM(user_id, name, price, percent, explanation, img, deadline) VALUES(?, ?, ?, ?, ?, ?, ?) ";
		
		const accessToken: string = req.cookies.accessToken;
		const user: any = jwt.verify(accessToken, process.env.ACCESS_SECRET || '');
		console.log(user);
		const userId = user.id;
		
		
		const data = [userId, name, price, percent, describe, image, deadline];
		
		await pool.query(query, data);
		res.redirect('/item');
	}
	catch(err){
		console.error(err);
	}
}

const renderItemList: RequestHandler = async(req : Request, res: Response) => {

	let query = "SELECT * FROM ITEM";

	const [rows, fields]: [item[], FieldPacket[]] = await pool.query(query);
    const items = rows;

	res.render('itemList', {items: items});
}

const renderItemId: RequestHandler = async(req: Request, res: Response) => {
	
	const {id} = req.params;
	
	// const item = await Item.findOne({
	// 	where: { id }  
	// });
	
	res.render('itemDetail', {});
}

export {renderItem, postItem, renderItemList, renderItemId};