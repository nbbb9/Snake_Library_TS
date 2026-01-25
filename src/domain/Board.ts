import {Position} from "../value-objects/Position";

export class Board {
    readonly width: number;
    readonly height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    public isInside(position: Position): boolean {
        return (
            position.x >= 0 &&
            position.x < this.width &&
            position.y >= 0 &&
            position.y < this.height
        );
    }

    public isCollide(position: Position): boolean {
        return !this.isInside(position);
    }
}