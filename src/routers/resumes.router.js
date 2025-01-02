// express 모듈에서 가져온다. express 는 서버를 만들기 위해 도와주는 도구이다.
import express from 'express';

// 뒤의 경로를 타고가서 HTTP_STATUS 를 불러온다
import { HTTP_STATUS } from '../constants/http-status.constant.js';

// 뒤의 경로를 타고가서 MESSAGES 를 불러온다
import { MESSAGES } from '../constants/message.constant.js';

// 뒤의 경로를 타고가서 createResumeValidator 를 불러온다
import { createResumeValidator } from '../middlewares/validators/create-resume-validator.middleware.js';

// 뒤의 경로를 타고가서 prisma 를 불러온다
import { prisma } from '../utils/prisma.util.js';

// 뒤의 경로를 타고가서 updateResumeValidator 를 불러온다
import { updateResumeValidator } from '../middlewares/validators/update-resume-validator.middleware.js';

// Router 메서드를 사용하여 현재 파일에서 router 를 실행해 준다.
const resumesRouter = express.Router();

// 이력서 생성
// /api/resumes/ url 을 post로 요청 시 createResumeValidator 미들웨어로 검증 후 함수를 실행한다.
resumesRouter.post('/', createResumeValidator, async (req, res, next) => {
  try {
    // createResumeValidator 미들웨어 에서 검증된 user data 를 상수로 저장해준다
    const user = req.user;
    // req.body 로 title, content을 json파일로 받는다.(json 파일은 app.js 파일에서 json 으로 받는다고 설정했음)
    const { title, content } = req.body;
    // authorId 상수안에 미들웨어에서 검증된 user의 id를 저장한다.
    const authorId = user.id;

    //resume 테이블에 authorId, title, content 가 포함된 값을 저장한다.
    const data = await prisma.resume.create({
      data: {
        authorId,
        title,
        content,
      },
    });

    // 성공 status, 메시지, data 전달
    return res.status(HTTP_STATUS.CREATED).json({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.RESUMES.CREATE.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});

// 이력서 목록 조회
// /api/resumes/ url 을 get 으로 요청받을 시 함수를 실행한다.
resumesRouter.get('/', async (req, res, next) => {
  try {
    // req 로 가지고 있는 user의 값을 user 에 저장해준다.(index 에서 미들웨어 검증하여 user data 가지고 있음)
    const user = req.user;
    const authorId = user.id;

    // sort 로 값을 받아와서 저장한다. req.query 는 url에 ?sort="" 를 사용하여 매개변수들을 포함하는 방법이다. 예시) /api/resumes/?sort="abc"
    let { sort } = req.query;

    // sort 의 string 값을을 모두 소문자로 변경해준다. toLowerCase() 모든 영단어를 대문자에서 소문자로 변환해주는 함수이다.
    sort = sort?.toLowerCase();

    if (sort !== 'desc' && sort !== 'asc') {
      sort = 'desc';
    }

    // resume 테이블에서 찾아서 data 변수에 저장한다.
    let data = await prisma.resume.findMany({
      // authorId 값이 같은 객체를 찾는다.
      where: { authorId },
      orderBy: {
        // 등록한 순서대로 정렬
        createdAt: sort,
      },
      include: {
        // 객체의 값중 author 값만 보이게 하여 전달한다.
        author: true,
      },
    });
    // data 에 저장된 값을 아래와 같이 key:value 로 저장하여 배열로 변환해준다.
    data = data.map((resume) => {
      return {
        id: resume.id,
        authorName: resume.author.name,
        title: resume.title,
        content: resume.content,
        status: resume.status,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      };
    });

    // 성공 status 200 과 메시지, data 를 전달해준다.
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.READ_LIST.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});

// 이력서 상세 조회
// /api/resumes/:id url 을 get 으로 요청받을 시 함수를 실행한다.
resumesRouter.get('/:id', async (req, res, next) => {
  try {
    // user 상수로 req.user 저장
    const user = req.user;
    // authorId 상수로 user.id 저장
    const authorId = user.id;

    // url에서 :id 값을 받아온다.
    const { id } = req.params;

    // resume 테이블에서 id 값과 authorId 이 같은 data를 찾아와 author 값을 저장한다.
    let data = await prisma.resume.findUnique({
      where: { id: +id, authorId },
      include: { author: true },
    });

    // data 가 없을시 에러를 전달한다.
    if (!data) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.RESUMES.COMMON.NOT_FOUND,
      });
    }

    // 찾은 data를 아래와 같이 값을 저장해준다.
    data = {
      id: data.id,
      authorName: data.author.name,
      title: data.title,
      content: data.content,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    // 성공 status 200 과 메시지, data 를 전달해준다.
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.READ_DETAIL.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});

// 이력서 수정
// /api/resumes/:id url 을 put 으로 요청받을 시 updateResumeValidator 미들웨어로 검증하고 함수를 실행한다.
resumesRouter.put('/:id', updateResumeValidator, async (req, res, next) => {
  try {
    const user = req.user;
    const authorId = user.id;

    const { id } = req.params;

    // 수정할 부분인 title, content 을 req.body 에서 받아온다.
    const { title, content } = req.body;

    // resume 테이블에서 id 와 authorId 가 같은 data 를 받아온다
    let existedResume = await prisma.resume.findUnique({
      where: { id: +id, authorId },
    });

    // data 가 없을 시 에러 반환
    if (!existedResume) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.RESUMES.COMMON.NOT_FOUND,
      });
    }

    // 찾은 data를 req.body로 받은 값으로 변환해준다.
    const data = await prisma.resume.update({
      where: { id: +id, authorId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
      },
    });

    // 성공 메시지 전달
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.UPDATE.SUCCEED,
      data,
    });
  } catch (error) {
    next(error);
  }
});

// 이력서 삭제
// /api/resumes/:id url 을 put 으로 요청받을 시 함수를 실행한다.
resumesRouter.delete('/:id', async (req, res, next) => {
  try {
    const user = req.user;
    const authorId = user.id;

    const { id } = req.params;

    let existedResume = await prisma.resume.findUnique({
      where: { id: +id, authorId },
    });

    // 찾는 값이 없을 시 에러 발생
    if (!existedResume) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.RESUMES.COMMON.NOT_FOUND,
      });
    }

    // delete 메서드를 사용하여 resume 테이블에서 해당 값을 삭제
    const data = await prisma.resume.delete({ where: { id: +id, authorId } });

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.DELETE.SUCCEED,
      data: { id: data.id },
    });
  } catch (error) {
    next(error);
  }
});

export { resumesRouter };

const schema = Joi.string().custom((value, helpers) => {
  if (value !== 'valid') {
    return helpers.error('any.invalid');
  }
  return value;
});