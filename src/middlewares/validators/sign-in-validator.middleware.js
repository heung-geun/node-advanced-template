// joi 모듈을 Joi 변수로 불러온다. 
// joi 는 자바스크립트에서 데이터 유효성 검사를 수행하기에 아주 좋은 라이브러리이다.
import Joi from 'joi';

// 상위 폴더로 2번 올라가서 constants 폴더 안에 message.constant.js 파일에 있는 MESSAGES 를 불러온다. 
// MESSAGES 는 다양한 메시지들을 가지고 있다.
import { MESSAGES } from '../../constants/message.constant.js';

// schema 상수에 Joi.object 를 사용하여 어떠한 방식으로 검증할 것인지 규칙을 정해 선언해 두었다.
const schema = Joi.object({
  // Joi 뒤에 있는 메서드 들이 어떤 방식으로 검증할 것인지 정해둔 방법들이다.
  email: Joi.string().email().required().messages({
    'any.required': MESSAGES.AUTH.COMMON.EMAIL.REQUIRED,
    'string.email': MESSAGES.AUTH.COMMON.EMAIL.INVALID_FORMAT,
  }),
  password: Joi.string().required().messages({
    'any.required': MESSAGES.AUTH.COMMON.PASSWORD.REQURIED,
  }),
});

// signInValidator 함수를 내보내 준다. 
// signInValidator 함수는 validateAsync 메서드를 사용하여 주어진 데이터가 알맞는 구조로 되어있는지 검증한다.
export const signInValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
