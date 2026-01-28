import { Snake } from '../domain/Snake';
import { Board } from '../domain/Board';
import { Direction } from '../value-objects/Direction';
import { Position } from '../value-objects/Position';
import { GameStatus } from './GameStatus';

export class GameEngine {
    private _snake: Snake;
    private _board: Board;
    private _status: GameStatus;

    constructor(boardWidth: number, boardHeight: number, snakeStartPosition: Position, snakeStartDirection: Direction, snakeStartLength: number = 1) {
        this._board = new Board(boardWidth, boardHeight);
        // 여기서 뱀의 시작 지점이 맵의 사이즈 밖이라면 에러 로직 추가해야함.
        this._snake = new Snake(snakeStartPosition, snakeStartDirection, snakeStartLength);
        this._status = GameStatus.READY;
    }

    // --- 외부에서 상태를 읽기 위한 메서드들 ---
    get status(): GameStatus { return this._status; }
    get snake(): Snake { return this._snake; }
    get board(): Board { return this._board; }

    // --- 외부에서 호출하는 조작 메서드들 ---

    /**
     * 게임을 시작 상태로 변경합니다.
     */
    start(): void {
        if (this._status === GameStatus.READY) {
            this._status = GameStatus.PLAYING;
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
        }

        // (나중에 여기에 '아이템 충돌', '자기 몸 충돌' 체크 로직 추가 예정)

        return this._status;
    }
}