import express from 'express';

import{
	renderItemList, renderItem, postItem, renderItemId, postOrder, renderMyItemList
} from '../controllers/item';
import{idCheck, tokenCheck} from '../middlewares/auth';

const router = express.Router();

router.get('/', tokenCheck, renderItem);

router.post('/', tokenCheck, postItem);

router.get('/list/:id', tokenCheck, idCheck, renderMyItemList);
router.get('/list', renderItemList);

router.post('/order', postOrder);

router.get('/:id', renderItemId);



export default router;