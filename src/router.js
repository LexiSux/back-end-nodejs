import { Router } from 'express';
import UserCtrls from './controller/users';
import AuthController from './controller/auth';
import { AuthMiddleware } from './controller/utils';

import PostCtrls from './controller/post';

const rtr = Router();

// --------------- users -------------------
rtr.use('/auth', AuthController);
rtr.use('/api/v1', AuthMiddleware);
rtr.use('/api/v1/users', UserCtrls);

// --------------- post -------------------
rtr.use('/api/v1/posts', PostCtrls);

export default rtr;