# Turtle Neck 퀴즈 (React + Vite)

## 실행 방법

```bash
cd ~/Documents/quiz
npm install
npm run dev
```

터미널에 두 개의 주소가 나옵니다.

```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

- Mac에서 볼 때: `Local` 주소
- **태블릿에서 볼 때: `Network` 주소** (Mac과 태블릿이 같은 Wi-Fi에 있어야 해요)

## 태블릿에서 전체 화면으로 쓰기

- **iPad (Safari):** 공유 버튼 → "홈 화면에 추가" → 홈 화면 아이콘으로 열기
- **갤럭시 탭 (Chrome):** 메뉴(⋮) → "홈 화면에 추가"

주소창 없이 앱처럼 열려요.

## 접속이 안 될 때

- Mac과 태블릿이 같은 Wi-Fi인지 확인 (학교·공용 Wi-Fi는 기기끼리 접속을 막는 경우가 있어요. 그럴 땐 휴대폰 핫스팟에 둘 다 연결해 보세요)
- Mac 방화벽 알림이 뜨면 "허용"

## 경품 룰렛

퀴즈를 다 풀면 결과 화면에서 경품 룰렛으로 넘어가요.

- 하루 수량: 키링 15개, 젤리 50개 (`src/prize.js`의 `DAILY_STOCK`)
- 당첨 확률 = 남은 키링 ÷ 남은 경품 전체 → 처음엔 15/65(약 23%)이고, 남은 수량에 따라 자동 조정돼서 하루 수량이 정확히 맞게 나가요
- 남은 수량은 **태블릿 브라우저에 저장**돼요 (태블릿 1대로 운영하는 기준)
- 3문제 다 맞힌 사람만 돌리게 하려면 `src/prize.js`에서 `REQUIRE_ALL_CORRECT = true`

### 스태프용 재고 관리

사이트 주소 뒤에 `?admin`을 붙여서 열면 시작 화면 아래에 재고 패널이 나와요.

```
https://yeverycode.github.io/turtle-neck-quiz/?admin
```

- 행사 날 아침에 **"오늘 수량으로 초기화"** 누르기
- 실제 남은 수량과 다르면 −/+ 로 맞추기
- 확인 후 `?admin` 없는 주소로 다시 열어두기

## 파일 구조

- `src/assets/bg.jpg` — 배경 이미지
- `src/quizData.js` — 문제 목록 (여기만 고치면 문제 변경/추가 가능)
- `src/App.jsx` — 시작 → 문제 → 결과 화면
- `src/Roulette.jsx` — 경품 룰렛, 스태프용 재고 패널
- `src/prize.js` — 경품 수량·확률 설정
- `src/App.css` — 스타일 (태블릿 가로/세로 대응)

## 문제 수정하기

`src/quizData.js`에서 형식은 아래와 같아요. `answer`는 정답 보기의 번호(1부터)예요.

```js
{
  category: '하드웨어',
  q: '문제 내용',
  options: ['보기1', '보기2', '보기3'],
  answer: 3,
  explain: '해설 (비워두면 표시 안 함)',
},
```
