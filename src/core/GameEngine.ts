import { Snake } from '../domain/Snake';
import { Board } from '../domain/Board';
import { Direction } from '../value-objects/Direction';
import { Position } from '../value-objects/Position';
import { GameStatus } from './GameStatus';
import {Food, FoodType} from "../domain/Food";

export class GameEngine {
    private _snake: Snake;
    private _board: Board;
    private _status: GameStatus;
    private _food: Food | null = null;
    private _lastFoodPosition: Position | null = null;
    private readonly FOOD_SPAWN_CHANCE = 0.1; // 음식 생성 확률 ( 0.1 = 10% 확률로 매 step마다 생성 시도)
    private readonly POISON_LIFETIME = 10;

    constructor(
        boardWidth: number,
        boardHeight: number,
        snakeStartPosition: Position,
        snakeStartDirection: Direction,
        snakeStartLength: number = 1
    ) {
        this._board = new Board(boardWidth, boardHeight);
        // 여기서 뱀의 시작 지점이 맵의 사이즈 밖이라면 에러 로직 추가해야함.
        this._snake = new Snake(snakeStartPosition, snakeStartDirection, snakeStartLength);
        this._status = GameStatus.READY;
    }

    get status(): GameStatus { return this._status; }
    get snake(): Snake { return this._snake; }
    get board(): Board { return this._board; }
    get food() : Food | null { return this._food; }

    // --- 외부에서 호출하는 조작 메서드들 ---

    /**
     * 게임을 시작 상태로 변경합니다.
     */
    start(): void {
        if (this._status === GameStatus.READY) {
            this._status = GameStatus.PLAYING;
            this.spawnFood(); // 게임 시작 직후 바로 하나 생성
        }
    }

    /**
     * 게임의 시간을 한 단계 진행시킵니다.
     * 이 메서드를 1초에 한번 호출하면 턴제 게임, 0.1초에 한번 호출하면 리얼타임 게임이 됩니다.
     * @param inputDirection (선택) 사용자가 입력한 방향. 없으면 가던 방향으로 계속 감.
     * @returns 진행 결과 상태
     */
    step(inputDirection?: Direction): GameStatus {
        // 게임 중이 아니라면 로직을 수행하지 않음
        if (this._status !== GameStatus.PLAYING) {
            return this._status;
        }
        // 음식이 맵에 존재하지 않을경우 랜덤으로 음식을 생성한다.
        if (this._food === null) {
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
        try {
            this._snake.move(nextDirection);
        } catch (e) {
            // (예: 180도 회전 시도 등) 에러 발생 시 무시하고 원래 방향으로 강제 이동
            // 사용자 경험을 위해 게임을 멈추기보다 무시하고 진행하는 것이 자연스러움
            this._snake.move(this._snake.direction);
        }

        // 3. 벽 충돌 체크 (Rule Check)
        // 뱀의 머리가 보드 밖으로 나갔다면 게임 오버
        if (this._board.isCollide(this._snake.head)) {
            this._status = GameStatus.GAME_OVER;
            return this._status;
        }

        if (this._food && this._food.position.isEqual(this._snake.head)) {
            this._snake.eat(this._food);
            // console.log(`[Engine] Ate ${FoodType[this._food.type]}`);
            // 독을 먹어서 몸이 사라졌다면(길이 0) 게임 오버
            if (this._snake.body.length === 0) {
                this._status = GameStatus.GAME_OVER;
                return this._status;
            }

            this._lastFoodPosition = this._food.position; // 먹힌 위치 기억
            this._food = null; // 음식 사라짐
        }

        return this._status;
    }

    // --- 음식 생성 관렴 메서드 ---

    /**
     * 확률에 따라 음식을 생성합니다.
     */
    private trySpawnFood(): void {
        if (Math.random() < this.FOOD_SPAWN_CHANCE) {
            this.spawnFood();
        }
    }

    /**
     * 음식을 생성합니다. (유효한 위치를 찾아서)
     */
    private spawnFood(): void {
        const position = this.findValidFoodPosition();
        if (position) {
            const type = this.getRandomFoodType();
            const lifeTime = (type === FoodType.POISON) ? this.POISON_LIFETIME : Infinity;
            this._food = new Food(position, type, lifeTime);
        }
    }

    /**
     * 조건에 맞는 랜덤 타입 반환
     */
    private getRandomFoodType(): FoodType {
        // 50:50 확률로 결정 (나중에 확률 조정 가능)
        return Math.random() < 0.5 ? FoodType.GROW : FoodType.POISON;
    }

    /**
     * 유효한 빈 좌표를 찾습니다.
     * @returns Position | null (맵이 꽉 차서 놓을 곳이 없으면 null)
     */
    private findValidFoodPosition(): Position | null {
        // 무한 루프 방지를 위해 최대 시도 횟수 설정
        const maxAttempts = 50;

        for (let i = 0; i < maxAttempts; i++) {
            const x = Math.floor(Math.random() * this._board.width);
            const y = Math.floor(Math.random() * this._board.height);
            const candidate = new Position(x, y);

            // 유효성 검증
            if (this.isValidPosition(candidate)) {
                return candidate;
            }
        }

        // 50번 시도했는데도 자리가 없으면 이번엔 생성 포기 (다음 틱에 다시 시도)
        return null;
    }

    /**
     * 해당 좌표가 음식 놓기에 안전한지 검사 (조건 1, 2)
     */
    private isValidPosition(pos: Position): boolean {
        // 조건 1: 뱀의 몸통(머리 포함)과 겹치지 않을 것
        // some 함수: 배열 요소 중 하나라도 조건을 만족하면 true
        const isOverlapSnake = this._snake.body.some(segment => segment.isEqual(pos));
        if (isOverlapSnake) return false;

        // 조건 2: 바로 전에 생성된(먹힌) 위치와 같지 않을 것
        if (this._lastFoodPosition && this._lastFoodPosition.isEqual(pos)) {
            return false;
        }

        return true;
    }

}