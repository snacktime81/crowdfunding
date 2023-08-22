import {RequestHandler, Request, Response, NextFunction} from 'express';
import Item from '../models/item';

import { Item as itemType } from '../types/item';

const renderItemList: RequestHandler = async(req : Request, res: Response) => {
	
	let items: itemType[] = await Item.findAll();
	res.render('itemList', {items: items});
}

export {renderItemList};