
// express 모듈에서 가져온다. express 는 서버를 만들기 위해 도와주는 도구이다.
import express from 'express';

// 뒤의 경로를 타고가서 requireAccessToken 를 불러온다
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';

// 뒤의 경로를 타고가서 HTTP_STATUS 를 불러온다
import { HTTP_STATUS } from '../constants/http-status.constant.js';

// 뒤의 경로를 타고가서 MESSAGES 를 불러온다
import { MESSAGES } from '../constants/message.constant.js';

// Router 메서드를 사용하여 현재 파일에서 router 를 실행해 준다.
const usersRouter = express.Router();

// 내프로필 조회
// /api/users/me url 을 get으로 요청 시 requireAccessToken 미들웨어로 검증 후 함수를 실행한다.
usersRouter.get('/me', requireAccessToken, (req, res, next) => {
  try {
    const data = req.user;

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.USERS.READ_ME.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});

// usersRouter 를 내보낸다
export { usersRouter };
