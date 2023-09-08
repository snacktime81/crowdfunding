import {RequestHandler, Request, Response, NextFunction} from 'express';
//import Item from '../models/item';

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

export {renderMain, renderLogin, renderJoin, renderMain2, logout,};