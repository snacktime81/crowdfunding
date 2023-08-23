import express from 'express';
import{
	renderItemList, renderItem, postItem, renderItemId
} from '../controllers/item';

import{
	loginAuth, 
} from '../controllers/auth';

const router = express.Router();

router.get('/', loginAuth);
router.get('/', renderItem);

router.post('/', loginAuth);
router.post('/', postItem)

router.get('/list', renderItemList);

router.get('/:id', renderItemId);

export default router;