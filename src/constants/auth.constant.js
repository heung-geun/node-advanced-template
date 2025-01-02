// 비밀번호 해싱에 사용되는 솔트의 라운드 수를 나타낸다(10번 섞는다고 생각하면됨), 
// 숫자가 높을수록 보안은 강화되지만 처리속도가 느려지는 단점이 있다.
export const HASH_SALT_ROUNDS = 10;

// 비밀번호의 최소길이를 정의한다 최소 6개 이상을 의미한다.
export const MIN_PASSWORD_LENGTH = 6;

// 액세스 토큰의 만료시간을 알려준다. 12시간동안만 유효하다는 것을 의미한다.
export const ACCESS_TOKEN_EXPIRES_IN = '12h';
