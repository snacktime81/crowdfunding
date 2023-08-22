import express from 'express';
import{
	renderMain, renderLogin, renderItem, postItem, renderJoin, renderMain2, logout, renderItemList
} from '../controllers/page';

import{
	loginAuth, isLoggedIn, isNotLoggedIn, refreshToken
} from '../controllers/auth';

const router = express.Router();


router.get('/', isNotLoggedIn, refreshToken, renderMain);
router.get('/', isLoggedIn, renderMain2);

router.get('/login', renderLogin);
router.get('/join', renderJoin);
router.get('/logout', logout);

router.use('/item', loginAuth);
router.get('/item', renderItem);

router.get('/item/list', renderItemList);

router.post('/item', postItem)

export default router;