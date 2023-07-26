import {RequestHandler, Request, Response} from 'express';

const renderMain: RequestHandler = (req: Request, res: Response) => {
 	res.render('index');
};

const renderLogin: RequestHandler = (req : Request, res: Response) => {
	res.render('login');
}

const renderItem: RequestHandler = (req : Request, res: Response) => {
	res.render('item');
}

export {renderMain, renderLogin, renderItem};