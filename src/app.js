// express 모듈에서 가져온다. express 는 서버를 만들기 위해 도와주는 도구이다.
import express from 'express';

// constants 라는 상수를 정의하는 폴더에서 환경변수들 중에 SERVER_PORT 를 가져온다
import { SERVER_PORT } from './constants/env.constant.js';

// middlewares 폴더안에 error-handler.middleware.js 에서 errorHandler 을 가져온다.
// errorHandler 은 joi 에서 발생하는 에러를 걸러주는 미들웨어 이다.
import { errorHandler } from './middlewares/error-handler.middleware.js';

// constants 폴더안에 http-status.constant.js 파일안에서 HTTP_STATUS 를 가져온다.
// HTTP_STATUS 는 에러 상태들을 정의하는 객체이다
import { HTTP_STATUS } from './constants/http-status.constant.js';

// routers 폴더안에 index.js 파일에서 apiRouter 를 가져온다. apiRouter 는 express 의 라우터 이다.
import { apiRouter } from './routers/index.js';

// express 를 실행하여 app 서버를 만든다.
const app = express();

// use 메서드를 사용하여 미들웨어를 정의한다. express.json 을 사용할 수 있게 한다.
// express.json을 사용하면 클라이언트가 json 요청으로 데이터를 보낼 때 서버가 파싱(인식,변환)해서 req.bady 에 데이터를 넣는다.
app.use(express.json());

// urlencoded 는 HTML 폼 데이터를 처리하기 위해 사용된다.
// HTML 폼 데이터는 input 이나 textarear 같은 태그로 들어오는 데이터를 말한다. 
// extended 속성의 값으로 true를 입력하게 되면 qs 모듈을 사용하여 복잡한 구조를 지닌 경우에도 해석이 가능하게 된다.
app.use(express.urlencoded({ extended: true }));

// health-check url로 get 요청을 한다. 서버가 정상적으로 작동하면 HTTP_STATUS.OK 인 200 번 코드와 함께 I'm healthy 를 반환한다.
app.get('/health-check', (req, res) => {
  return res.status(HTTP_STATUS.OK).send(`I'm healthy.`);
});

// /api 로 요청이 들어오면 apiRouter 미들웨어가 사용된다.
app.use('/api', apiRouter);

// errorHandler 미들웨어가 사용가능하게 된다.
app.use(errorHandler);

// listen 메서드를 사용하여 SERVER_PORT 인 3000 번 포트를 연결하게 된다.
app.listen(SERVER_PORT, () => {
  console.log(`서버가 ${SERVER_PORT}번 포트에서 실행 중입니다.`);
});
