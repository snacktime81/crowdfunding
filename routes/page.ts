import express from 'express';
import{
	renderMain, renderLogin, renderItem
} from '../controllers/page';

const router = express.Router();

router.get('/', renderMain);

router.get('/login', renderLogin);

router.get('/item', renderItem);

export default router;