import {describe, expect, it} from 'vitest';
import {Position} from "../src/value-objects/Position";
import {Food} from "../src/domain/Food";

describe('Food 객체', () => {
    it('랜덤한 위치에서 먹이가 생성되어야 한다.', () => {
        const x = Math.random();
        const y = Math.random();

        const randomPosition = new Position(x, y);

        const food = new Food(randomPosition);

        expect(food.location.x).toBe(x);
        expect(food.location.y).toBe(y);
    });
})