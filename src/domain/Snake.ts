import {Position} from '../value-objects/Position';
import {Direction} from '../value-objects/Direction';

export class Snake {
    private _body: Position[];
    private _currentDirection: Direction

    constructor(startPosition: Position, startDirection: Direction, startLength: number = 1) {
        this._body = [startPosition];
        this._currentDirection = startDirection;// 초기 방향

        if (startLength > 1) {// 초기 몸의 길이가 1보다 크다면 설정값을 _body에 추가
            this.initBody(startLength)
        }
    }

    private initBody(length: number) : void {
        let lastPosition = this.head;

        for (let i = 1; i < length; i++) {
            const tailPosition = this.calculateTailPosition(lastPosition, this._currentDirection);
            this._body.push(tailPosition)
            lastPosition = tailPosition;
        }
    }

    // 현재 진행 방향의 '반대쪽' 좌표를 계산하는 헬퍼
    private calculateTailPosition(current: Position, direction: Direction): Position {
        switch (direction) {
            case Direction.UP:    return new Position(current.x, current.y + 1); // 위로 가니 꼬리는 아래에
            case Direction.DOWN:  return new Position(current.x, current.y - 1); // 아래로 가니 꼬리는 위에
            case Direction.LEFT:  return new Position(current.x + 1, current.y); // 왼쪽으로 가니 꼬리는 오른쪽에
            case Direction.RIGHT: return new Position(current.x - 1, current.y); // 오른쪽으로 가니 꼬리는 왼쪽에
            default: return current;
        }
    }

    // 외부에서는 뱀의 몸통을 읽기만 가능 (Getter. 수정 불가)
    get body(): Position[] {
        // [...this._body] : 스프레드 연산자
        // Java의 new ArrayList<>(this._body) 와 같다.
        // 원본 배열의 '복사본'을 반환. (방어적 복사)
        return [...this._body];
    }

    // 머리 위치 반환
    get head(): Position {
        return this._body[0];
    }

    // 이동 메서드
    move(direction: Direction): void {

        if (this.isOpposite(direction)) {
            direction = this._currentDirection;
        }

        const head = this.head;
        let newHead: Position;

        // 1. 방향에 따라 새 머리 위치 계산
        switch (direction) {
            case Direction.UP:
                newHead = new Position(head.x, head.y - 1);
                break;
            case Direction.DOWN:
                newHead = new Position(head.x, head.y + 1);
                break;
            case Direction.LEFT:
                newHead = new Position(head.x - 1, head.y);
                break;
            case Direction.RIGHT:
                newHead = new Position(head.x + 1, head.y);
                break;
            default:
                throw new Error("Invalid Direction");
        }

        // 2. 새 머리를 앞에 붙임 (이동)
        this._body.unshift(newHead);
        // 3. 꼬리를 자름 (이동 효과)
        this._body.pop();
        // 4. 현재 방향 업데이트
        this._currentDirection = direction;
    }

    // 반대 방향인지 체크하는 헬퍼 메서드
    private isOpposite(newDir: Direction): boolean {
        if (this._currentDirection === Direction.UP && newDir === Direction.DOWN) return true;
        if (this._currentDirection === Direction.DOWN && newDir === Direction.UP) return true;
        if (this._currentDirection === Direction.LEFT && newDir === Direction.RIGHT) return true;
        if (this._currentDirection === Direction.RIGHT && newDir === Direction.LEFT) return true;
        return false;
    }
}