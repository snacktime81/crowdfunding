import express from 'express';
import{
	renderItemList
} from '../controllers/item';

const router = express.Router();

router.get('/list', renderItemList);


export default router;