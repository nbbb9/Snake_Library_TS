
export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

// 방향 관련 로직 Util
export const DirectionUtil = {
    /**
     * 인자로 받은 진행방향의 반대 방향 반환
     * @param direction
     * @returns Direction
     */
    getOppositeDirection(direction: Direction) : Direction {
        switch (direction) {
            case Direction.UP: return Direction.DOWN;
            case Direction.DOWN: return Direction.UP;
            case Direction.LEFT: return Direction.RIGHT;
            case Direction.RIGHT: return Direction.LEFT;
        }
    },
    /**
     * 인자로 받은 진행방향의 실제 좌표 Delta 값
     * @param direction
     * @returns { dx: number, dy: number }
     */
    getMoveDelta(direction: Direction) : { dx: number, dy: number } {
        switch (direction) {
            case Direction.UP: return { dx: 0, dy: -1 };
            case Direction.DOWN: return { dx: 0, dy: 1 };
            case Direction.LEFT: return { dx: -1, dy: 0 };
            case Direction.RIGHT: return { dx: 1, dy: 0 };
        }
    }
};