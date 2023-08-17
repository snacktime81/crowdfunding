import express from 'express';
import{
	renderMain, renderLogin, renderItem, postItem, renderJoin, renderMain2
} from '../controllers/page';

import{
	loginAuth, isLoggedIn, isNotLoggedIn,
} from '../controllers/auth';

const router = express.Router();


router.get('/', isNotLoggedIn, renderMain);
router.get('/', isLoggedIn, renderMain2);

router.get('/login', renderLogin);
router.get('/join', renderJoin);

router.use('/item', loginAuth);
router.get('/item', renderItem);

router.post('/item', postItem)

export default router;