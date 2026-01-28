import { GameEngine } from '../core/GameEngine';
import { GameStatus } from '../core/GameStatus';
import {FoodType} from "../domain/Food";

export class ConsoleDebugger {
    // 엔진을 주입받습니다 (Dependency Injection)
    constructor(private engine: GameEngine) {}

    print(stepName: string = ''): void {
        const board = this.engine.board;
        const snake = this.engine.snake;
        const food = this.engine.food;

        const width = board.width;
        const height = board.height;

        // 뱀의 좌표 변환
        const bodyCoords = snake.body.map(p => `${p.x},${p.y}`);
        const headCoord = `${snake.head.x},${snake.head.y}`;

        // 먹이 좌표 변환(먹이가 존재할 경우만)
        let foodCoord = "";
        if (food) {
            foodCoord = `${food.position.x},${food.position.y}`;
        }

        let output = `\n--- [Status: ${GameStatus[this.engine.status]} | ${stepName}] ---\n`;

        // y축 루프
        for (let y = 0; y < height; y++) {
            let row = '|';// 왼쪽 벽
            // x축 루프
            for (let x = 0; x < width; x++) {
                const currentKey = `${x},${y}`;

                if (currentKey === headCoord) {
                    row += 'H'; // 머리
                } else if (food && currentKey === foodCoord) {

                    row += (food.type === FoodType.GROW) ? 'G' : 'P'; // 타입에 따라 다른 글자로 표현
                } else if (bodyCoords.includes(currentKey)) {
                    row += 'o'; // 몸통
                } else {
                    row += '.'; // 빈 공간
                }
                row += ' '; // 가독성을 위한 공백
            }
            row += '|'; // 오른쪽 벽
            output += row + '\n';
        }

        output += '-'.repeat(width * 2 + 2);
        console.log(output);
    }
}