// constants 폴더안에 http-status.constant.js 파일안에서 HTTP_STATUS 를 가져온다.
// HTTP_STATUS 는 에러 상태들을 정의하는 객체이다
import { HTTP_STATUS } from '../constants/http-status.constant.js';

// 에러 메세지를 처리하는 함수를 내보내 준다.
export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // joi에서 발생한 에러 처리
  if (err.name === 'ValidationError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: HTTP_STATUS.BAD_REQUEST,
      message: err.message,
    });
  }

  // 그 밖의 예상치 못한 에러 처리
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
  });
};
