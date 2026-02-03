
export enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

export const DirectionData: Record<Direction, { dx: number, dy: number, opposite: Direction }> = {
    [Direction.UP]:    { dx: 0,  dy: -1, opposite: Direction.DOWN },
    [Direction.DOWN]:  { dx: 0,  dy: 1,  opposite: Direction.UP },
    [Direction.LEFT]:  { dx: -1, dy: 0,  opposite: Direction.RIGHT },
    [Direction.RIGHT]: { dx: 1,  dy: 0,  opposite: Direction.LEFT }
}