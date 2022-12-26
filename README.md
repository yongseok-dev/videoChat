# VideoChat

- 화상 채팅 프로그램
- Node.js, WebRTC, WebSocket

## Node.js

- JavaScript 런타임
- dev환경에서 nodemon을 사용하면 편리
- Babel은 javascript 로 결과물을 만들어주는 컴파일러
- express: node.js 환경에서 서버를 만들어 주는 패키지
- express에는 view를 위한 pug, ejs 등 템플릿 엔진(Template Engine) 사용

## WebSocket

- HTTP: stateless, user.req <-> server.res
  - server에서 user에게 먼저 요청할 수 없음
- WebSocket: `ws://` bi-directional connection state를 유지
  - 브라우저 내 WebSocket API 사용
  - Backend server implementation (node.js: ws core패키지)

## WebRTC
