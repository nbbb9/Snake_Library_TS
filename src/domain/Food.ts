import {Position} from '../value-objects/Position'

export enum FoodType {
    GROW, POISON
}

export class Food {
    private _position: Position;
    private _type: FoodType;

    constructor(location: Position, type: FoodType = FoodType.GROW) {
        this._position = location;
        this._type = type;
    }

    get position(): Position {
        return this._position;
    }

    get type() : FoodType {
        return this._type;
    }

}