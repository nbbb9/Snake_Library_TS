import {Position} from '../value-objects/Position';
import {Direction, DirectionUtil} from '../value-objects/Direction';
import {Food, FoodType} from "./Food";

export class Snake {
    private _body: Position[];
    private _currentDirection: Direction

    constructor(startPosition: Position, startDirection: Direction, length: number = 1) {
        this._body = [startPosition]; // 초기 몸의 길이
        this._currentDirection = startDirection;// 초기 방향

        if (length > 1) {// 초기 몸의 길이가 1보다 크다면 설정값을 _body에 추가
            this.initBody(length)
        }
    }

    // 초기 몸의 길이를 설정하는 메서드
    private initBody(length: number) : void {
        // 현재 머리 위치 기준으로 현재 위치 입력
        let lastPosition: Position = this.head;
        // 현재 뱀의 진행 방향의 반대방향을 꼬리의 방향으로 설정
        const tailDirection: Direction = DirectionUtil.getOppositeDirection(this._currentDirection);
        // 현재 위치를 기준으로 꼬리 방향으로 몸통을 하나씩 증가
        for (let i = 1; i < length; i++) {
            const nextPosition: Position = this.getNextPosition(lastPosition, tailDirection);
            this._body.push(nextPosition);
            lastPosition = nextPosition;
        }
    }

    // 몸통 위치 반환
    get body(): Position[] {
        return [...this._body]; // [...this._body] : 스프레드 연산자. 원본 배열의 '복사본'을 반환. (방어적 복사)
    }

    // 머리 위치 반환
    get head(): Position {
        return this._body[0];
    }

    // 진행 방향 반환
    get direction(): Direction {
        return this._currentDirection;
    }

    // 이동 메서드
    move(direction: Direction): void {
        // 현재 진행 방향의 반대 방향을 구하고 그쪽으로 꼬리를 늘린다.
        if (direction === DirectionUtil.getOppositeDirection(this._currentDirection)) {
            direction = this._currentDirection;
        }
        // 뱀의 현재 머리 위치와 방향에 따라 새로운 머리 위치 계산
        const newHead = this.getNextPosition(this.head, direction);

        this._body.unshift(newHead); // 맨 앞에 하나 추가하고 머리로 설정
        this._body.pop(); // 맨 뒤에서 하나 제거
        this._currentDirection = direction; // 인자로 받은 방향을 현재 방향으로 설정
    }

    // 뱀의 이동 방향에 따른 다음 좌표 계산 메서드
    private getNextPosition(current: Position, direction: Direction): Position {
        const delta = DirectionUtil.getMoveDelta(direction);
        return new Position(current.x + delta.dx, current.y + delta.dy);
    }

    // 섭취 메서드
    eat(food: Food) {
        if (food.type === FoodType.GROW) {
            this.grow();
        }
    }

    // 성장 메서드
    private grow() {
        const tail = this._body[this._body.length - 1];
        this._body.push(new Position(tail.x, tail.y));
    }
}