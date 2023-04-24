import type { RequestHandler } from 'express';
import { Router } from 'express';

import { testApi, testPost } from '../controllers/test.controller';
import { validateRequest } from '../middleware/validateRequest';
import { TestReq } from '../models/test.schema';
const router = Router();

router.get('/test', testApi as RequestHandler);
router.post('/test', validateRequest({ body: TestReq }) as RequestHandler, testPost);

export default router;
