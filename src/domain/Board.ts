import {Position} from "../value-objects/Position";

export class Board {
    readonly width: number;
    readonly height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    // 내부에 있는지 여부 판단 메서드
    public isInside(position: Position): boolean {
        return (
            position.x >= 0 &&
            position.x < this.width &&
            position.y >= 0 &&
            position.y < this.height
        );
    }

    // 충돌 여부 판단 메서드. 내부에 있으면 충돌이 아니고,
    // 내부에 없으면 충돌이므로 isIndside의 반대값을 리턴
    public isCollide(position: Position): boolean {
        return !this.isInside(position);
    }
}