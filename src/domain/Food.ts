import {Position} from '../value-objects/Position'

export enum FoodType {
    GROW, POISON
}

export class Food {
    private _location: Position;
    private _type: FoodType;

    constructor(location: Position, type: FoodType = FoodType.GROW) {
        this._location = location;
        this._type = type;
    }

    get location(): Position {
        return this._location;
    }

    get type() : FoodType {
        return this._type;
    }

}