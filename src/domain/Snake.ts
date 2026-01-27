import {Position} from '../value-objects/Position';
import {Direction, DirectionUtil} from '../value-objects/Direction';

export class Snake {
    private _body: Position[];
    private _currentDirection: Direction

    constructor(startPosition: Position, startDirection: Direction, startLength: number = 1) {
        this._body = [startPosition]; // 초기 몸의 길이
        this._currentDirection = startDirection;// 초기 방향

        if (startLength > 1) {// 초기 몸의 길이가 1보다 크다면 설정값을 _body에 추가
            this.initBody(startLength)
        }
    }

    // 초기 몸의 길이를 설정하는 메서드
    private initBody(length: number) : void {
        let lastPosition = this.head;// 현재 머리 위치 기준으로 현재 위치 입력

        const tailDirection = DirectionUtil.getOppositeDirection(this._currentDirection);

        for (let i = 1; i < length; i++) {
            const nextPosition = this.getNextPosition(lastPosition, tailDirection);
            this._body.push(nextPosition);
            lastPosition = nextPosition;
        }
    }

    // 외부에서는 뱀의 몸통을 읽기만 가능
    get body(): Position[] {
        // [...this._body] : 스프레드 연산자. 원본 배열의 '복사본'을 반환. (방어적 복사)
        return [...this._body];
    }

    // 머리 위치 반환
    get head(): Position {
        return this._body[0];
    }

    // 이동 메서드
    move(direction: Direction): void {

        if (direction === DirectionUtil.getOppositeDirection(this._currentDirection)) {
            direction = this._currentDirection;
        }

        const newHead = this.getNextPosition(this.head, direction);

        this._body.unshift(newHead);
        this._body.pop();
        this._currentDirection = direction;
    }

    // 뱀의 좌표 계산 메서드
    private getNextPosition(current: Position, direction: Direction): Position {
        const delta = DirectionUtil.getMoveDelta(direction);
        return new Position(current.x + delta.dx, current.y + delta.dy);
    }

}