import { Position } from '../value-objects/Position';
import { Direction } from '../value-objects/Direction';

export class Snake {
    private _body: Position[];

    constructor(startPosition: Position) {
        this._body = [startPosition];
    }

    // 외부에서는 뱀의 몸통을 읽기만 가능 (Getter. 수정 불가)
    get body(): Position[] {
        // [...this._body] : 스프레드 연산자
        // Java의 new ArrayList<>(this._body) 와 같다.
        // 원본 배열의 '복사본'을 반환. (방어적 복사)
        return [...this._body];
    }

    // 머리 위치 반환 (자주 쓰임)
    get head(): Position {
        return this._body[0];
    }

    move(direction: Direction): void {
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
    }
}