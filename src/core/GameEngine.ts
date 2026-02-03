import { Snake } from '../domain/Snake';
import { Board } from '../domain/Board';
import { Direction } from '../enums/Direction';
import { Position } from '../value-objects/Position';
import { GameStatus } from '../enums/GameStatus';
import { Food } from "../domain/Food";
import { FoodType } from "../enums/FoodType";
import { StepResult } from "../interfaces/IGameEngine";
import { ISoundPlayer } from '../interfaces/ISoundPlayer';

export class GameEngine {
    private _snake: Snake;
    private _board: Board;
    private _status: GameStatus;
    private _food: Food | null = null;
    private _lastFoodPosition: Position | null = null; // 마지막 음식 위치
    // TODO 음식 생성 확률과 음식 생존 시간, 긍정 음식 생성 비율을 모두 생성자에서 인자로 받아 설정하게 할 수 있다.
    private readonly FOOD_SPAWN_RATE = 0.6; // 음식 생성 확률 ( 0.1 = 10% 확률로 매 step마다 생성 시도)
    private readonly GROW_FOOD_GEN_RATE = 0.6; // 긍정 음식 생성 확률
    private readonly POISON_LIFETIME = 10; // 독성 음식 생존 시간 (n턴)
    private _totalGrowFoodEaten: number = 0; // 뱀이 먹은 총 '성장'먹이 개수(= 점수)
    private _totalPoisonFoodEaten: number = 0; // 뱀이 먹은 총 '독성'먹이 개수
    private _isWallCollideDeath: boolean = true; // 벽에 부딪히면 죽는지 여부(기본값 true)
    private _soundPlayer?: ISoundPlayer;

    constructor(
        initBoard: Board, // 맵 초기 세팅
        snakeStartPosition: Position, // 뱀의 시작 위치(좌표)
        snakeStartDirection: Direction, // 뱀의 시작 방향
        snakeStartLength: number = 1, // 뱀의 시작 길이
        isWallCollideDeath?: boolean, // 벽 충돌 시 사망 여부
        soundPlayer?: ISoundPlayer
    ) {
        this._board = initBoard;

        // 구조 분해 할당. 각각의 Key에 대한 값을 꺼내서 똑같은 이름의 변수로 만든다.
        const {x, y} = snakeStartPosition;
        const {width, height} = this._board;

        if (x < 0 || x >= width || y < 0 || y >= height) {
            throw new Error( `유효하지 않은 뱀의 시작 위치입니다 : (${x}, ${y}) / 맵의 크기는 (${width}x${height}).`)
        }

        this._snake = new Snake(snakeStartPosition, snakeStartDirection, snakeStartLength);
        this._status = GameStatus.READY; // 초기 게임의 상태는 무조건 '준비'이다.
        this._totalGrowFoodEaten = 0;
        this._isWallCollideDeath = isWallCollideDeath ? isWallCollideDeath : true;
        this._soundPlayer = soundPlayer;
    }

    get status() : GameStatus { return this._status; }
    get snake(): Snake { return this._snake; }
    get board(): Board { return this._board; }
    get food() : Food | null { return this._food; }
    get totalGrowFoodEaten(): number { return this._totalGrowFoodEaten; }
    get totalPoisonFoodEaten(): number { return this._totalPoisonFoodEaten; }
    get isWallCollideDeath() : boolean { return this._isWallCollideDeath }

    /**
     * 게임을 시작상태로 설정
     */
    start(): void {
        if (this._status === GameStatus.READY) {
            this._status = GameStatus.PLAYING;
            // TODO 인자값에 따라 시작하자마자 음식을 생성할지 말지 나눌 수 있다. 여기서 또는 엔진 생성자에서?
            this.spawnFood(); // 게임 시작 직후 바로 하나 생성
        }
    }

    /**
     * 게임의 시간을 한 단계 진행
     * @param inputDirection 사용자가 입력한 방향. 없으면 가던 방향으로 계속 감.
     * @returns 진행 결과 상태
     */
    step(inputDirection?: Direction): StepResult {
        // 게임 중이 아닐 경우 예외 처리
        if (this._status !== GameStatus.PLAYING) {
            throw new Error('게임이 실행중이 아닙니다.')
            // return { status: this._status, event: 'NONE' }; TODO 예외를 던질지 그냥 현재 상태를 반환할지 고민
        }

        this.handleFoodLifeCycle(); // 음식 생성 및 수명 관리
        this.moveSnake(inputDirection); // 뱀 이동 처리

        if (this.checkWallCollide()) { // 벽 충돌 체크
            return { status: this._status, event: 'WALL_COLLIDE' };
        }
        // 뱀의 음식 섭취
        const event = this.eatFood();

        return { status: this._status, event: event };
    }

    // 뱀 이동 로직
    private moveSnake(inputDirection?: Direction): void {
        // 이동할 방향 결정 입력이 있으면 그 방향으로, 없으면 뱀이 원래 가던 방향으로
        const nextDirection: Direction = inputDirection ?? this._snake.direction;
        // TODO 진행 방향의 정반대(180도) 입력이 들어오면 게임을 GameOver로 할지 고민. 현재는 그냥 진행하도록 설정.
        try {
            this._snake.move(nextDirection);
        } catch (e) {
            this._snake.move(this._snake.direction);
        }
    }

    // 벽 충돌 체크
    private checkWallCollide(): boolean {
        if (!this._isWallCollideDeath) {
            // TODO 벽에 부딪혀도 죽지 않는다면...?
            return false;
        }
        if (this._board.isCollide(this._snake.head)) {
            this._status = GameStatus.GAME_OVER;
            return true;
        }
        return false;
    }

    // 뱀의 음식 섭취
    private eatFood(): StepResult['event'] {
        if (!this._food || !this._food.position.isEqual(this._snake.head)) {
            return 'MOVED';
        }

        let event: StepResult['event'] = 'MOVED';

        // 음식 타입별 효과 처리
        if (this._food.type === FoodType.GROW) {
            event = 'ATE_GROW';
            this._totalGrowFoodEaten++; // 섭취한 총 '성장'먹이 개수 증가
            this._soundPlayer?.playSfx('audios/eat-grow.mp3', 0.9);
        } else if (this._food.type === FoodType.POISON) {
            event = 'ATE_POISON';
            this._totalPoisonFoodEaten++; // 섭취한 총 '독성'먹이 개수 증가
            this._soundPlayer?.playSfx('audios/eat-hurt.mp3', 0.9);
        }

        this._snake.eat(this._food);

        if (this._snake.body.length === 0) { // 독을 먹어서 몸이 사라졌다면(길이 0) 게임 오버
            this._status = GameStatus.GAME_OVER;
            return event; //
        }

        this._lastFoodPosition = this._food.position; // 먹힌 위치 기억
        this._food = null; // 음식 사라짐

        return event;
    }

    //  음식 생성 및 수명 관리
    private handleFoodLifeCycle(): void {
        if (this._food === null) { // 음식이 맵에 존재하지 않을경우 랜덤으로 음식을 생성한다.
            this.trySpawnFood();
        } else {
            this._food.decay(); // 음식이 존재한다면 음식의 수명을 깎는다.
            if (this._food.isExpired) { // 음식의 수명이 다했다면 제거
                this._food = null;
            }
        }
    }
    // 확률에 따라 음식을 생성
    private trySpawnFood(): void {
        if (Math.random() < this.FOOD_SPAWN_RATE) {
            this.spawnFood();
        }
    }
    // 음식을 랜덤 위치에 생성
    private spawnFood(): void {
        const position: Position | null = this.findValidFoodPosition(); // 유효한 빈 좌표 찾기
        if (position) {
            const type: FoodType = this.getRandomFoodType(); // 랜덤 음식 타입
            const lifeTime: number = (type === FoodType.POISON) ? this.POISON_LIFETIME : Infinity; // 타입에 따라 폐기 시간 설정
            this._food = new Food(position, type, lifeTime);
        }
    }
    // 조건에 맞는 랜덤 음식 타입 반환
    private getRandomFoodType(): FoodType {
        return Math.random() < this.GROW_FOOD_GEN_RATE ? FoodType.GROW : FoodType.POISON;
    }
    // 유효한 빈 좌표를 찾는다 (맵이 꽉 차서 놓을 곳이 없으면 null)
    private findValidFoodPosition(): Position | null {
        const maxAttempts = 50; // 최대 시도 횟수

        for (let i = 0; i < maxAttempts; i++) {
            const x: number = Math.floor(Math.random() * this._board.width);
            const y: number = Math.floor(Math.random() * this._board.height);
            const candidate = new Position(x, y); // 좌표 후보

            if (this.isValidPosition(candidate)) { // 좌표 유효성 검증
                return candidate; // 문제가 없다면 좌표 후보 반환
            }
        }
        // 50번 시도 이후에도 자리가 없으면 다음 step에 생성 시
        return null;
    }
    // 해당 좌표가 음식 놓기에 안전한지 검사
    private isValidPosition(pos: Position): boolean {
        // 뱀의 몸 & 머리와 겹치지 않을 것
        // some 함수: 배열 요소 중 하나라도 조건을 만족하면 true
        const isOverlapSnake: boolean = this._snake.body.some(position => position.isEqual(pos));
        if (isOverlapSnake) return false; // 겹치는것이 있다면 false
        // 바로 전에 생성된(먹힌) 위치와 같지 않을 것
        if (this._lastFoodPosition && this._lastFoodPosition.isEqual(pos)) {
            return false;
        }
        return true;
    }

}