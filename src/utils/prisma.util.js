// @prisma/client 모듈에서 PrismaClient 기능을 불러온다.
import { PrismaClient } from '@prisma/client';

// prisma 상수에 새로운 PrismaClient를 생성해 준다.
export const prisma = new PrismaClient({
  // Prisma를 이용해 데이터베이스를 접근할 때, SQL을 출력해줍니다.
  log: ['query', 'info', 'warn', 'error'],

  // 에러 메시지를 평문이 아닌, 개발자가 읽기 쉬운 형태로 출력해줍니다.
  errorFormat: 'pretty',
}); // PrismaClient 인스턴스를 생성합니다.

// 연결이 성공했는지 실패했는지 확인해준다. 
try {
  await prisma.$connect();
  console.log('DB 연결에 성공했습니다.');
} catch (error) {
  console.error('DB 연결에 실패했습니다.', error);
}
