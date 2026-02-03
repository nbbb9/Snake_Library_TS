import {Position} from '../value-objects/Position';
import {Direction} from '../enums/Direction';
import {DirectionUtil} from "../utils/DirectionUtil";
import {Food} from "./Food";
import {FoodType} from "../enums/FoodType";

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

    get body(): Position[] { return [...this._body]; }// [...this._body] : 스프레드 연산자. 원본 배열의 '복사본'을 반환. (방어적 복사)
    get head(): Position { return this._body[0]; }
    get direction(): Direction { return this._currentDirection; }

    /**
     * 인자로 받은 현재 이동방향에 따라 위치를 이동시킨다.
     * @param direction
     * @return void
     */
    move(direction: Direction): void {
        // TODO 현재 진행방향과 180도 다른 방향이 입력되었을 경우 처리 방안.(현재는 강제로 현재 진행방향으로 변경함)
        direction = this.ignoreOppositeDirection(direction);

        // 뱀의 현재 머리 위치와 방향에 따라 새로운 머리 위치 계산
        const newHead = this.getNextPosition(this.head, direction);

        this._body.unshift(newHead); // 맨 앞에 하나 추가하고 머리로 설정
        this._body.pop(); // 맨 뒤에서 하나 제거
        this._currentDirection = direction; // 인자로 받은 방향을 현재 방향으로 설정
    }

    /**
     * 뱀이 자신의 몸에 충돌했는지 체크하는 메서드
     * @returns true: collide, false: not collide
     */
    isSelfCollide(): boolean {
        const head = this.head;
        const body = this._body.slice(1); // 머리를 제외한 나머지 몸. 1번 인덱스부터 끝까지 자른 배열
        // 몸통 중 머리와 좌표가 하나라도 같으면 충동(true) 반환
        return body.some(position => position.isEqual(head));
    }

    // 정반대 방향을 무시하는 메서드
    private ignoreOppositeDirection(direction: Direction): Direction {
        if (direction === DirectionUtil.getOppositeDirection(this._currentDirection)) {
            return this._currentDirection;
        }
        return direction;
    }

    // 뱀의 이동 방향에 따른 다음 좌표 계산 메서드
    private getNextPosition(current: Position, direction: Direction): Position {
        const delta = DirectionUtil.getMoveDelta(direction); // 인자로 받은 이동 방향의 실제 좌표 Delta값을 구한다.
        return new Position(current.x + delta.dx, current.y + delta.dy); // delta값을 인자로 받은 position에 적용한다.
    }

    /**
     * 뱀의 섭취 메서드. 음식의 타입에 따라 성장 또는 축소
     * @param food
     * @return void
     */
    eat(food: Food) {
        if (food.type === FoodType.GROW) {
            this.grow();
        }
        if (food.type === FoodType.POISON) {
            this.cut();
        }
    }
    // 성장 메서드
    private grow() {
        const tail: Position = this._body[this._body.length - 1];
        this._body.push(new Position(tail.x, tail.y));
    }
    // 축소 메서드
    private cut() {
        this._body.pop();
    }
}