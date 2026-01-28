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

    // 파기 여부 확인
    get isExpired(): boolean {
        return this.expiresIn <= 0;
    }

    get position(): Position {
        return this._position;
    }

    get type() : FoodType {
        return this._type;
    }

    /**
     * 부패 : 음식의 수명을 깎는다
     */
    decay(): void {
        if (this.expiresIn !== Infinity) {
            this.expiresIn--;
        }
    }

}