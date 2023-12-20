import express from 'express';

import{
	renderItemList, renderItem, postItem, renderItemId, postOrder
} from '../controllers/item';
import{tokenCheck} from '../middlewares/auth';

const router = express.Router();

router.get('/', tokenCheck, renderItem);

router.post('/', tokenCheck, postItem);

router.get('/list', renderItemList);

router.post('/order', postOrder);

router.get('/:id', renderItemId);

export default router;