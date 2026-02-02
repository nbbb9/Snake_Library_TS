import { Snake } from '../domain/Snake';
import { Board } from '../domain/Board';
import { Direction } from '../enums/Direction';
import { Position } from '../value-objects/Position';
import { GameStatus } from '../enums/GameStatus';
import { Food } from "../domain/Food";
import { FoodType } from "../enums/FoodType";
import { ISoundPlayer } from '../interfaces/ISoundPlayer';

export class GameEngine {
    private _snake: Snake;
    private _board: Board;
    private _status: GameStatus;
    private _food: Food | null = null;
    private _lastFoodPosition: Position | null = null; // 마지막 음식 위치
    // TODO 음식 생성 확률과 음식 생존 시간을 모두 생성자에서 인자로 받아 설정하게 할 수 있다.
    private readonly FOOD_SPAWN_CHANCE = 0.1; // 음식 생성 확률 ( 0.1 = 10% 확률로 매 step마다 생성 시도)
    private readonly POISON_LIFETIME = 10; // 독성 음식 생존 시간 (n턴)
    private _totalEaten: number = 0; // 뱀이 먹은 총 '성장'먹이 개수(= 점수)
    private _soundPlayer?: ISoundPlayer;

    constructor(
        boardWidth: number, // 맵 가로
        boardHeight: number, // 맵 세로
        snakeStartPosition: Position, // 뱀의 시작 위치(좌표)
        snakeStartDirection: Direction, // 뱀의 시작 방향
        snakeStartLength: number = 1, // 뱀의 시작 길이
        soundPlayer?: ISoundPlayer
    ) {
        this._board = new Board(boardWidth, boardHeight);
        // TODO 여기서 뱀의 시작 지점이 맵의 사이즈 밖이라면 에러 로직 추가해야함.
        this._snake = new Snake(snakeStartPosition, snakeStartDirection, snakeStartLength);
        this._status = GameStatus.READY; // 초기 게임의 상태는 무조건 '준비'이다.
        this._totalEaten = 0;
        this._soundPlayer = soundPlayer;
    }

    get status(): GameStatus { return this._status; }
    get snake(): Snake { return this._snake; }
    get board(): Board { return this._board; }
    get food() : Food | null { return this._food; }
    get totalEaten(): number { return this._totalEaten; }

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
    step(inputDirection?: Direction): GameStatus {
        // 게임 중이 아니라면 로직을 수행하지 않음
        if (this._status !== GameStatus.PLAYING) {
            console.log("Game is not playing")
            return this._status;
        }
        // TODO 내부에 복잡한 로직을 메서드로 분리?
        if (this._food === null) { // 음식이 맵에 존재하지 않을경우 랜덤으로 음식을 생성한다.
            this.trySpawnFood();
        } else {
            this._food.decay(); // 음식이 존재한다면 음식의 수명을 깎는다.

            if (this._food.isExpired) { // 음식의 수명이 다했다면 제거
                this._food = null;
            }
        }
        // 이동할 방향 결정 입력이 있으면 그 방향으로, 없으면 뱀이 원래 가던 방향으로
        const nextDirection = inputDirection ?? this._snake.direction;
        // 뱀 이동 시도
        // TODO 진행 방향의 정반대(180도) 입력이 들어오면 게임을 GameOver로 할지 고민. 현재는 그냥 진행하도록 설정.
        try {
            this._snake.move(nextDirection);
        } catch (e) {
            this._snake.move(this._snake.direction);
        }
        // 벽 충돌 체크 (Rule Check)
        // 뱀의 머리가 보드 밖으로 나갔다면 게임 오버
        if (this._board.isCollide(this._snake.head)) {
            this._status = GameStatus.GAME_OVER;
            return this._status;
        }
        // 먹이 섭취.
        if (this._food && this._food.position.isEqual(this._snake.head)) {
            // soundPlayer가 있으면 play() 호출, 없으면 아무 일도 안 일어남 (에러 안 남)
            if (this._food.type === FoodType.GROW) {
                this._totalEaten++;
                this._soundPlayer?.playSfx('audios/eat-grow.mp3', 0.9);
            } else if (this._food.type === FoodType.POISON) {
                this._soundPlayer?.playSfx('audios/eat-hurt.mp3', 0.9);
            }

            this._snake.eat(this._food);
            if (this._snake.body.length === 0) { // 독을 먹어서 몸이 사라졌다면(길이 0) 게임 오버
                this._status = GameStatus.GAME_OVER;
                return this._status;
            }
            this._lastFoodPosition = this._food.position; // 먹힌 위치 기억
            this._food = null; // 음식 사라짐
        }

        return this._status;
    }

    // --- 음식 생성 관련 메서드 ---
    /**
     * 확률에 따라 음식을 생성
     */
    private trySpawnFood(): void {
        if (Math.random() < this.FOOD_SPAWN_CHANCE) {
            this.spawnFood();
        }
    }
    /**
     * 음식을 랜덤 위치에 생성
     */
    private spawnFood(): void {
        const position = this.findValidFoodPosition(); // 유효한 빈 좌표 찾기
        if (position) {
            const type = this.getRandomFoodType(); // 랜덤 음식 타입 (5 : 5)
            const lifeTime = (type === FoodType.POISON) ? this.POISON_LIFETIME : Infinity; // 타입에 따라 폐기 시간 설정
            this._food = new Food(position, type, lifeTime);
        }
    }
    /**
     * 조건에 맞는 랜덤 타입 반환
     * 50:50 확률로 결정 (나중에 확률 조정 가능)
     */
    private getRandomFoodType(): FoodType {
        // TODO 여기서 음식의 비율을 설정값으로 받도록 설정할 수 있다.
        return Math.random() < 0.5 ? FoodType.GROW : FoodType.POISON;
    }
    /**
     * 유효한 빈 좌표를 찾는다
     * @returns Position | null (맵이 꽉 차서 놓을 곳이 없으면 null)
     */
    private findValidFoodPosition(): Position | null {
        const maxAttempts = 50; // 최대 시도 횟수

        for (let i = 0; i < maxAttempts; i++) {
            const x = Math.floor(Math.random() * this._board.width);
            const y = Math.floor(Math.random() * this._board.height);
            const candidate = new Position(x, y); // 좌표 후보

            if (this.isValidPosition(candidate)) { // 좌표 유효성 검증
                return candidate; // 문제가 없다면 좌표 후보 반환
            }
        }
        // 50번 시도 이후에도 자리가 없으면 다음 step에 생성 시
        return null;
    }
    /**
     * 해당 좌표가 음식 놓기에 안전한지 검사
     */
    private isValidPosition(pos: Position): boolean {
        // 뱀의 몸 & 머리와 겹치지 않을 것
        // some 함수: 배열 요소 중 하나라도 조건을 만족하면 true
        const isOverlapSnake = this._snake.body.some(position => position.isEqual(pos));
        if (isOverlapSnake) return false; // 겹치는것이 있다면 false
        // 바로 전에 생성된(먹힌) 위치와 같지 않을 것
        if (this._lastFoodPosition && this._lastFoodPosition.isEqual(pos)) {
            return false;
        }
        return true;
    }

}