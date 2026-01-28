import { GameEngine } from '../core/GameEngine';
import { GameStatus } from '../core/GameStatus';
import {FoodType} from "../domain/Food";

export class ConsoleDebugger {
    // 엔진을 주입받는다 (Dependency Injection)
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
            let row = '|'; // 왼쪽 벽
            // x축 루프
            for (let x = 0; x < width; x++) {
                const currentKey = `${x},${y}`;

                let cell = '';

                if (currentKey === headCoord) {
                    cell = 'H '; // 알파벳(1) + 공백(1) = 2칸
                } else if (food && currentKey === foodCoord) {
                    // 이모지(2) = 2칸 (공백 없음)
                    cell = (food.type === FoodType.GROW) ? '🍎' : '🍄';
                } else if (bodyCoords.includes(currentKey)) {
                    cell = 'o '; // 알파벳(1) + 공백(1) = 2칸
                } else {
                    cell = '. '; // 점(1) + 공백(1) = 2칸
                }

                row += cell;
            }
            row += '|'; // 오른쪽 벽
            output += row + '\n';
        }

        output += '-'.repeat(width * 2 + 2);
        console.log(output);
    }
}