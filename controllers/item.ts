import {RequestHandler, Request, Response, NextFunction} from 'express';
import Item from '../models/item';

import { Item as itemType } from '../types/item';

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
	
	let items: itemType[] = await Item.findAll();
	res.render('itemList', {items: items});
}

export {renderItem, postItem, renderItemList};