import express from 'express';

import{
	renderQAndA, postQAndA, renderQAndAId, renderQAndAList, renderFAQList, renderMyQAList
} from '../controllers/qAndA';
import{tokenCheck, idCheck} from '../middlewares/auth';

const router = express.Router();

router.get('/', tokenCheck, renderQAndA);

router.post('/', tokenCheck, postQAndA);

router.get('/list', tokenCheck, renderQAndAList)

router.get('/FAQ', renderFAQList)

router.get('/:id', renderQAndAId);

router.get('/list/:id', tokenCheck, idCheck, renderMyQAList);



export default router;
