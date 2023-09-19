import express from 'express';
import{
	renderItemList, renderItem, postItem, renderItemId, postOrder
} from '../controllers/item';

import{
	loginAuth, refreshToken, isLoggedIn, isNotLoggedIn
} from '../controllers/auth';

const router = express.Router();

router.get('/', isNotLoggedIn, refreshToken, loginAuth);
router.get('/', isLoggedIn, renderItem);


router.post('/', isLoggedIn, postItem);
router.post('/', refreshToken, loginAuth, postItem);

router.get('/list', renderItemList);

router.get('/:id', renderItemId);

router.post('/order', postOrder);

export default router;