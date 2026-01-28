
export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

// 방향 관련 로직 Util
export const DirectionUtil = {
    // 반대 방향을 찾는 메서드
    getOppositeDirection(direction: Direction) : Direction {
        switch (direction) {
            case Direction.UP: return Direction.DOWN;
            case Direction.DOWN: return Direction.UP;
            case Direction.LEFT: return Direction.RIGHT;
            case Direction.RIGHT: return Direction.LEFT;
        }
    },

    // 특정 방향으로 이동할 때의 좌표 변화량
    getMoveDelta(direction: Direction) : { dx: number, dy: number } {
        switch (direction) {
            case Direction.UP: return { dx: 0, dy: -1 };
            case Direction.DOWN: return { dx: 0, dy: 1 };
            case Direction.LEFT: return { dx: -1, dy: 0 };
            case Direction.RIGHT: return { dx: 1, dy: 0 };
        }
    }
};