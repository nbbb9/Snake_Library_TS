import { Position } from '../value-objects/Position'
import { FoodType } from "../enums/FoodType";

export class Food {
    private _position: Position;
    private _type: FoodType;
    public expiresIn: number; // 만료시간(단위 : 턴)

    constructor(
        location: Position,
        type: FoodType = FoodType.GROW,
        expiresIn: number = Infinity
    ){ // 음식의 기본 타입은 '성장'이고 기본 폐기 시간도 무제한으로 설정한다
        this._position = location;
        this._type = type;
        this.expiresIn = expiresIn;
    }

    // 파기 여부 확인
    get isExpired(): boolean { return this.expiresIn <= 0; }
    get position(): Position { return this._position; }
    get type() : FoodType { return this._type; }

    /**
     * 부패 : 음식의 수명을 깎는다(-1 턴)
     */
    decay(): void {
        if (this.expiresIn !== Infinity) {
            this.expiresIn--;
        }
    }

}