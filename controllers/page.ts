import {RequestHandler, Request, Response, NextFunction} from 'express';
import Item from '../models/item';

import { Item as itemType } from '../types/item';

const renderMain: RequestHandler = (req: Request, res: Response) => {
		res.render('index', {loginState: false});	
};

const renderMain2: RequestHandler = (req: Request, res: Response) => {
		res.render('index', {loginState: true});	
};

const renderLogin: RequestHandler = (req : Request, res: Response) => {
	res.render('login');
}

const renderJoin: RequestHandler = (req : Request, res: Response) => {
	res.render('join');
}

const renderItem: RequestHandler = (req : Request, res: Response) => {
	res.render('item');
}

const renderItemList: RequestHandler = async(req : Request, res: Response) => {
	
	let items: itemType[] = await Item.findAll();
	res.render('itemList', {items: items});
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

export {renderMain, renderLogin, renderItem, postItem, renderJoin, renderMain2, logout, renderItemList};