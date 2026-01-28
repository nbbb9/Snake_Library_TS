import {Position} from "../value-objects/Position";

export class Board {
    readonly width: number;
    readonly height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
    /**
     * 인자로 받은 좌표가 맵 내부에 존재하는지 안하는지 판단
     * @param position
     * @return boolean
     */
    public isInside(position: Position): boolean {
        return (
            position.x >= 0 &&
            position.x < this.width &&
            position.y >= 0 &&
            position.y < this.height
        );
    }
    /**
     * 인자로 받은 좌표의 충돌 여부 판단
     * @param position
     * @return boolean
     */
    public isCollide(position: Position): boolean {
        return !this.isInside(position);
    }
}