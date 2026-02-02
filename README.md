# 🐍TypeScript Snake Library🐍

# 🎮Clone후 게임 실행을 위한 단계🎮
## 1. 프로젝트 경로에서 ```npm install``` 수행.
## 2. 또는 프로젝트 경로에서 ```npm run play``` 수행.

# 00. Info

## 00-1. 컴퓨터의 좌표계

```
(0, 0)  -----------------------> X 증가 (+)
   |
   |      컴퓨터 화면 (Monitor)
   |
   |      (아래로 내려갈수록 Y값이 커집니다)
   |
   v
 Y 증가 (+)
```

y축은 아래로 갈 수록 값이 커진다. (Excel을 생각하면 편함)

## 00-2. 프로젝트 구조(변경 가능)

```
snake-game-lib/
├── src/
│   ├── core/                  # 게임 엔진
│   │   └── GameEngine.ts      # 게임 루프 및 전체 조율 담당
│   │
│   ├── domain/                # 핵심 비즈니스 로직 (상태와 행위를 가짐)
│   │   ├── Snake.ts           # 지렁이 (Position, Direction 사용)
│   │   ├── Food.ts            # 먹이 (Position, FoodType 사용)
│   │   └── Board.ts           # 맵 정보, 충돌 체크 로직
│   │
│   ├── enums/                 # 순수 상수 집합 (상태 없음, 로직 없음)
│   │   ├── Direction.ts       # UP, DOWN, LEFT, RIGHT
│   │   ├── FoodType.ts        # GROW, POISON
│   │   └── GameStatus.ts      # READY, PLAYING, GAME_OVER
│   │
│   ├── value-objects/         # 데이터 + 불변 로직 (값 객체)
│   │   └── Position.ts        # x, y 데이터 + isEqual() 로직 포함
│   │
│   ├── utils/                 # 순수 로직 및 헬퍼 함수
│   │   └── DirectionUtil.ts   # Direction Enum을 다루는 로직 분리
│   │
│   ├── interfaces/            # 확장성을 위한 규약
│   │   └── ISoundPlayer.ts    # 사운드 플레이어 인터페이스
│   │
│   ├── examples/              # 라이브러리 사용 예제 코드
│   │   ├── Play.ts            # 로컬 실행 및 테스트용 스크립트 (Manual/Auto)
│   │   ├── ConsoleDebugger.ts # 개발 및 디버깅용 시각화 도구
│   │   └── SoundPlayer.ts     # 사운드 플레이어 구현체
│   │
│   └── index.ts               # 라이브러리 정문 (외부 공개 모듈 export)
│
├── tests/                     # 테스트 코드
├── dist/                      # 빌드 결과물 (npm run build 시 생성)
├── vite.config.ts             # 라이브러리 빌드 설정
├── package.json
└── tsconfig.json
```

## 00-3. index.ts의 의의

1. 캡슐화 : 라이브러리 내부의 파일구조를 숨기는 효과가 있다.
2. 결합도 감소 : 내부 구조에 의존하지 않게 된다.

## 00-4. JS Array관련 기본 함수

1. .push() : 배열의 맨 끝에 값을 추가
2. .unshify() : 배열의 맨 앞에 값을 추가
3. .pop() : 배열의 맨 끝에 값을 제거
4. .shift() : 배열의 맨 앞에 값을 제거

# 01. Position.ts

# 02. Board.ts

# 03. Direction.ts

# 04. Snake.ts

# 05. Food.ts