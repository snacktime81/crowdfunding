import express from 'express';

import{
	renderItemList, renderItem, postItem, renderItemId, postOrder, renderMyItemList, renderMyItemId, putItem, deleteItem
} from '../controllers/item';
import{idCheck, tokenCheck, itemIdToUserIdCheck} from '../middlewares/auth';

const router = express.Router();

router.get('/', tokenCheck, renderItem);
router.post('/', tokenCheck, postItem);

router.get('/edit/:id', tokenCheck, itemIdToUserIdCheck, renderMyItemId);
router.put('/edit/:id', tokenCheck, itemIdToUserIdCheck, putItem);
router.get('/list', renderItemList);
router.get('/list/:id', tokenCheck, idCheck, renderMyItemList);

router.post('/order', postOrder);

router.get('/:id', renderItemId);

router.delete('/:id',tokenCheck, itemIdToUserIdCheck, deleteItem);



export default router;