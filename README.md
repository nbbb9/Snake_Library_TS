# TypeScript Snake Library

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
│   ├── core/                  # 코어. 실제 구현부
│		│   ├── GameEngine.ts      # 게임 엔진
│   │   └── GameStatus.ts      # 게임 상태(Enum)
│   │
│   ├── domain/                # 핵심 비즈니스 로직 (Entities)
│   │   ├── Snake.ts           # 지렁이 객체
│   │   ├── Food.ts            # 먹이 객체
│   │   └── Board.ts           # 맵 정보, 충돌 체크 로직
│   │
│   ├── interfaces/            # 외부와 소통하기 위한 규약
│   │
│   ├── value-objects/         # 불변 객체 (VO)
│   │   ├── Position.ts        # x, y 좌표 (불변성 보장)
│   │   └── Direction.ts       # Enum (UP, DOWN, LEFT, RIGHT)
│   │
│   └── index.ts               # 외부에서 사용할 클래스들만 export
│
├── tests/                     # 단위 테스트
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

X값과 Y값을 가지고 있는 Class

# 02. Board.ts

Map에 대한 정보 및 로직을 가지고 있는 Class

초기값(맵 크기)을 설정할 수 있고, 현재 위치에 따라 내부에 있는지 충돌했는지 여부를 알 수 있다.

# 03. Direction.ts

방향 Enum을 제공하고,

방향 관련 로직을 제공한다.

# 04. Snake.ts

# 05. Food.ts