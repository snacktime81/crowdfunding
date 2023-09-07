import {RequestHandler, Request, Response, NextFunction} from 'express';
import Item from '../models/item';

import { Item as itemType } from '../types/item';

import pool from "../models/db";

const renderItem: RequestHandler = (req : Request, res: Response) => {
	res.render('item');
}

const postItem: RequestHandler = async(req: Request, res: Response, next: NextFunction) => {
	try{

		const {name, price, percent, deadline, image, describe} = req.body;
		await Item.create({
			name,
			img: image,
			deadline,
			describe,
			percent,
			price,
			
			UserId : req.user?.id,
		})
		res.redirect('/item');
	}
	catch(err){
		console.error(err);
	}
}

const renderItemList: RequestHandler = async(req : Request, res: Response) => {
	

	const conn = await pool.getConnection();

	let query = "select * from items";

	const q = (await pool.query(query));
	console.log(q);

	const items: itemType[] = await Item.findAll();
	res.render('itemList', {items: items});
}

const renderItemId: RequestHandler = async(req: Request, res: Response) => {
	
	const {id} = req.params;
	
	const item = await Item.findOne({
		where: { id }  
	});
	
	res.render('itemDetail', {item});
}

export {renderItem, postItem, renderItemList, renderItemId};