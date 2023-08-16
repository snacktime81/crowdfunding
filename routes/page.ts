import express from 'express';
import{
	renderMain, renderLogin, renderItem, postItem, renderJoin,
} from '../controllers/page';

import{
	loginAuth,
} from '../controllers/auth';

const router = express.Router();


router.get('/', renderMain);

router.get('/login', renderLogin);
router.get('/join', renderJoin);

router.use('/item', loginAuth);
router.get('/item', renderItem);

router.post('/item', postItem)

export default router;