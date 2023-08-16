import {RequestHandler, Request, Response, NextFunction} from 'express';
import Item from '../models/item';
import {loginAuth} from '../controllers/auth';

const renderMain: RequestHandler = (req: Request, res: Response) => {
	res.render('index');
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

export {renderMain, renderLogin, renderItem, postItem, renderJoin};