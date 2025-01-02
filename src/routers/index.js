// express 모듈에서 가져온다. express 는 서버를 만들기 위해 도와주는 도구이다.
import express from 'express';

// auth.router.js 파일에서 authRouter 를 불러온다.
import { authRouter } from './auth.router.js';

// users.router.js 파일에서 usersRouter 를 불러온다.
import { usersRouter } from './users.router.js';

// resumes.router.j 파일에서 resumesRouter 를 불러온다.
import { resumesRouter } from './resumes.router.js';

// middlewares 폴더안에 require-access-token.middleware.js 파일에서 requireAccessToken 을 불러온다.
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';

// Router 메서드를 사용하여 해당 파일에서 router를 실행해 준다.
const apiRouter = express.Router();

// /auth url 을 요청시 authRouter 미들웨어 사용
apiRouter.use('/auth', authRouter);

// /users url 을 요청시 usersRouter 미들웨어 사용
apiRouter.use('/users', usersRouter);

// /resumes url 을 요청시 requireAccessTokem 미들웨어 사용 후 resumesRouter 미들웨어 사용
apiRouter.use('/resumes', requireAccessToken, resumesRouter);

// apiRouter 를 내보내 준다.
export { apiRouter };
