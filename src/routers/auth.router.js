// express 모듈에서 기능을 불러온다. express 는 서버를 만들기 위해 도와주는 도구이다.
import express from 'express';

//bcrypt 모듈에서 기능을 불러온다. 비밀번호를 해싱하기 위한 라이브러리이다(비밀번호를 비규칙적을 변환)
import bcrypt from 'bcrypt';

// jsonwebtoken 모듈을 jwt 로 불러온다. jsonwebtoken 은 JSON Web Token (JWT) 생성하고 검증을 하기 위한 모듈이다.
import jwt from 'jsonwebtoken';

// 뒤의 경로를 타고가서 HTTP_STATUS 를 불러온다
import { HTTP_STATUS } from '../constants/http-status.constant.js';

// 뒤의 경로를 타고가서 MESSAGES 를 불러온다
import { MESSAGES } from '../constants/message.constant.js';

// 뒤의 경로를 타고가서 signUpValidator 를 불러온다
import { signUpValidator } from '../middlewares/validators/sign-up-validator.middleware.js';

// 뒤의 경로를 타고가서 signInValidator 를 불러온다
import { signInValidator } from '../middlewares/validators/sign-in-validator.middleware.js';

// 뒤의 경로를 타고가서 prisma 를 불러온다
import { prisma } from '../utils/prisma.util.js';

// 뒤의 경로를 타고가서 ACCESS_TOKEN_EXPIRES_IN, HASH_SALT_ROUNDS 를 불러온다
import {
  ACCESS_TOKEN_EXPIRES_IN,
  HASH_SALT_ROUNDS,
} from '../constants/auth.constant.js';

// 뒤의 경로를 타고가서 ACCESS_TOKEN_SECRET 를 불러온다
import { ACCESS_TOKEN_SECRET } from '../constants/env.constant.js';

// express뒤에 .Router 메서드를 사용하여 router 기능을 나누어 실행해 준다. 비슷한 router 들을 모아 깔끔하게 관리하기 위해 사용
const authRouter = express.Router();

// 회원가입 api
// url로 sign-up 을 받아 post요청시 signUpValidator 미들웨어로 검증 후 함수를 실행해 준다.
authRouter.post('/sign-up', signUpValidator, async (req, res, next) => {
  try {
    // req.body로 email, password, name 값을 json(객체)으로 받는다.(app.js 에서 body는 json 으로 받기로했음)
    const { email, password, name } = req.body;

    // DB의 user 테이블에서 email 이 req.body의 email 과 같은 email 이 있는지 찾는다.
    const existedUser = await prisma.user.findUnique({ where: { email } });

    // 이메일이 중복된 경우 에러를 res 로 내보내준다.
    if (existedUser) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        status: HTTP_STATUS.CONFLICT,
        message: MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED,
      });
    }
    // 패스워드를 해싱해준다(비규칙적으로 (10회)변환해준다.)
    const hashedPassword = bcrypt.hashSync(password, HASH_SALT_ROUNDS);

    // prisma.user 테이블에 email, hashedPassword, name 을 추가해 준다.
    const data = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    data.password = undefined;

    // 생성성공 status 값인 201 과 메시지, 추가된 data 값을 반환해준다.
    return res.status(HTTP_STATUS.CREATED).json({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});

// 로그인 api
// /sign-in url 로 post 요청 시 signInValidator 미들웨어로 검증 후 함수를 실행 해준다.
authRouter.post('/sign-in', signInValidator, async (req, res, next) => {
  try {
    // req.body로 email, password 를 받아준다.
    const { email, password } = req.body;

    // user 상수에 req.body로 받은 email 을 user 테이블에서 찾아서 가져온다.(없을 시 undefind)
    const user = await prisma.user.findUnique({ where: { email } });

    // user 상수 와 패스워드 해칭을 풀어준다.
    const isPasswordMatched =
      user && bcrypt.compareSync(password, user.password);

    // isPasswordMatched 가 false 일 시 에러매시지를 반환해준다.
    if (!isPasswordMatched) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.COMMON.UNAUTHORIZED,
      });
    }

    // payload 상수안에 id: user.id 객체를 넣어준다.
    const payload = { id: user.id };

    // payload 에 액세스토큰을 생성해 준다.
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    // 로그인 성공status 200 과 메시지, accessToken 을 반환해 준다.
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
});

// authRouter 를 내보내 준다.
export { authRouter };
