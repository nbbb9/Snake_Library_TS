import { describe, it, expect } from 'vitest';
import { Snake } from '../src/domain/Snake';
import { Position } from '../src/value-objects/Position';
import { Direction } from '../src/value-objects/Direction'

describe('Snake 객체', () => {
    it('초기 위치에서 생성되어야 한다', () => {
        const startPos = new Position(5, 5);
        const snake = new Snake(startPos);

        expect(snake.head.x).toBe(5);
        expect(snake.head.y).toBe(5);
    });

    it('위(UP)로 이동하면 y좌표가 1 줄어들어야 한다', () => {
        const snake = new Snake(new Position(5, 5));

        snake.move(Direction.UP);

        expect(snake.head.x).toBe(5);
        expect(snake.head.y).toBe(4); // 5 -> 4
    });
});