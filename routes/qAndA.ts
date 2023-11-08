import express from 'express';
import{
	renderQAndA, postQAndA, renderQAndAId, renderQAndAList, renderFAQList
} from '../controllers/qAndA';

import{
	loginAuth, refreshToken, isLoggedIn, isNotLoggedIn, tokenCheck
} from '../controllers/auth';

const router = express.Router();

router.get('/', tokenCheck, renderQAndA);

router.post('/', tokenCheck, postQAndA);

router.get('/list', tokenCheck, renderQAndAList)

router.get('/:id', renderQAndAId);

router.get('/FAQ', renderFAQList)


export default router;
