import {RequestHandler, Request, Response, NextFunction} from 'express';

const renderMainNotLoggedIn: RequestHandler = (req: Request, res: Response) => {

		res.render('index', {loginState: false});	
};

const renderMainLoggedIn: RequestHandler = (req: Request, res: Response) => {
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

export {renderMainNotLoggedIn, renderMainLoggedIn, renderLogin, renderJoin, logout,};