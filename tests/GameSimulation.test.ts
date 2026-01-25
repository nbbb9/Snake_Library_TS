import {describe, expect, it} from 'vitest';
import {Snake} from '../src/domain/Snake'; // Snake는 이미 만드셨죠?
import {Board} from '../src/domain/Board';
import {Position} from '../src/value-objects/Position';
import {Direction} from "../src/value-objects/Direction";

describe('게임 시뮬레이션: 이동과 충돌', () => {

    it('뱀이 맵 끝까지 이동하다가 벽에 부딪혀야 한다', () => {
        // 1. 5x5 작은 맵 생성 (0,1,2,3,4)
        const board = new Board(5, 5);

        // 2. (2, 2) 중앙에서 시작하는 뱀 생성 (길이 1, 오른쪽 봄)
        const snake = new Snake(new Position(2, 2), Direction.RIGHT);
        printGameState(board, snake, "Start")

        // 3. 오른쪽으로 두 칸 이동 (좌표 변화: 2 -> 3 -> 4)
        snake.move(Direction.RIGHT); // x: 3 (안전)
        printGameState(board, snake, "Move Right 1")
        snake.move(Direction.RIGHT); // x: 4 (안전, 벽 바로 앞)
        printGameState(board, snake, "Move Right 2 (wall Front)")

        // 검증: 아직은 벽 안쪽임
        expect(board.isInside(snake.head)).toBe(true);

        // 4. 한 칸 더 이동 (x: 5 -> 벽)
        snake.move(Direction.RIGHT);
        printGameState(board, snake, "Move Right 3 (collide)")

        // 검증: 이제는 벽에 부딪혔음(Game Over 상황)
        expect(board.isCollide(snake.head)).toBe(true);
    });
});

describe('긴 뱀 테스트', () => {

    it('길이 3인 뱀이 생성되고 이동해야 한다', () => {
        const board = new Board(10, 10);

        // (5, 5)에서 시작, 오른쪽을 보고, 길이 3
        // 예상 모양:  o o H  (왼쪽인 3,4에 몸통이 생겨야 함)
        const snake = new Snake(new Position(5, 5), Direction.RIGHT, 3);

        printGameState(board, snake, "Start (Len 3)");

        // 검증: 몸통 개수 확인
        expect(snake.body.length).toBe(3);
        // 검증: 꼬리가 머리 왼쪽에 잘 붙었는지
        expect(snake.body[1].isEqual(new Position(4, 5))).toBe(true);
        expect(snake.body[2].isEqual(new Position(3, 5))).toBe(true);

        // 이동 테스트
        snake.move(Direction.DOWN);
        printGameState(board, snake, "Move DOWN");
    });
});

// 시각화 헬퍼 함수
function printGameState(board: Board, snake: Snake, stepName: string) {
    const width = board.width;
    const height = board.height;

    // 뱀의 몸통 좌표들을 문자열로 쉽게 비교하기 위해 Set이나 배열로 변환
    const bodyCoords = snake.body.map(p => `${p.x},${p.y}`);
    const headCoord = `${snake.head.x},${snake.head.y}`;

    let output = `\n--- [${stepName}] ---\n`;

    // Y축 루프 (위에서 아래로)
    for (let y = 0; y < height; y++) {
        let row = '|'; // 왼쪽 벽

        // X축 루프 (왼쪽에서 오른쪽으로)
        for (let x = 0; x < width; x++) {
            const currentKey = `${x},${y}`;

            if (currentKey === headCoord) {
                row += 'H'; // 머리 (Head)
            } else if (bodyCoords.includes(currentKey)) {
                row += 'o'; // 몸통 (Body)
            } else {
                row += '.'; // 빈 공간
            }
            row += ' '; // 가독성을 위해 공백 추가
        }
        row += '|'; // 오른쪽 벽
        output += row + '\n';
    }

    output += '-'.repeat(width * 2 + 2); // 바닥 벽
    console.log(output);
}