import { describe, it, expect } from 'vitest';
import { Board } from '../src/domain/Board';
import { Position } from '../src/value-objects/Position';

describe('Board 객체', () => {
    it('설정된 크기 내의 좌표는 안전하다고 판단해야 한다', () => {
        const board = new Board(10, 10); // 10x10 맵 (0~9)

        // (0,0)은 안전
        expect(board.isInside(new Position(0, 0))).toBe(true);
        // (9,9)는 안전
        expect(board.isInside(new Position(9, 9))).toBe(true);
    });

    it('경계를 벗어나면 벽 충돌로 판단해야 한다', () => {
        const board = new Board(10, 10);

        // x가 -1 (왼쪽 벽)
        expect(board.isCollide(new Position(-1, 0))).toBe(true);
        // x가 10 (오른쪽 벽, 인덱스는 0~9이므로 10은 벽)
        expect(board.isCollide(new Position(10, 0))).toBe(true);
    });
});