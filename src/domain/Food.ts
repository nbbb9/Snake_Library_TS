import {Position} from '../value-objects/Position'

export enum FoodType {
    GROW, POISON
}

export class Food {
    private _position: Position;
    private _type: FoodType;
    public expiresIn: number;

    constructor(location: Position, type: FoodType = FoodType.GROW, expiresIn: number = Infinity) {
        this._position = location;
        this._type = type;
        this.expiresIn = expiresIn;
    }

    // 턴이 지날 때마다 수명 감소
    decay(): void {
        if (this.expiresIn !== Infinity) {
            this.expiresIn--;
        }
    }

    // 수명이 다했는지 확인
    get isExpired(): boolean {
        return this.expiresIn <= 0;
    }

    get position(): Position {
        return this._position;
    }

    get type() : FoodType {
        return this._type;
    }

}