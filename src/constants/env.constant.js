// dotenv 모듈을 사용하여 .env 파일에 정의된 환경변수를 불러온다. 
// 이코드를 통해 .env 파일에 설정된 변수들이 process.env 객체에 추가된다
import 'dotenv/config';

// .env 파일에 있는 SERVER_PORT를 불러와서 export 로 내보내 준다. 만약에 process.env.SERVER_PORT 가 없을 시 undefined 가 된다.
export const SERVER_PORT = process.env.SERVER_PORT;

// 액세스토큰을 생성하고 검증하는데 사용되는 비밀키를 정의하여 해당 상수를 내보내 준다.
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
