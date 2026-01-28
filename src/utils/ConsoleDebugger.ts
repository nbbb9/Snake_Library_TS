import { GameEngine } from '../core/GameEngine';
import { GameStatus } from '../core/GameStatus';

export class ConsoleDebugger {
    // 엔진을 주입받습니다 (Dependency Injection)
    constructor(private engine: GameEngine) {}

    print(stepName: string = ''): void {
        const board = this.engine.board;
        const snake = this.engine.snake;
        // const food = this.engine.food;
        // 나중에 food도 여기서 engine.food로 가져오면 됨

        const width = board.width;
        const height = board.height;

        // ... (기존 로직 동일) ...
        const bodyCoords = snake.body.map(p => `${p.x},${p.y}`);
        const headCoord = `${snake.head.x},${snake.head.y}`;

        let output = `\n--- [Status: ${GameStatus[this.engine.status]} | ${stepName}] ---\n`;

        for (let y = 0; y < height; y++) {
            let row = '|';
            for (let x = 0; x < width; x++) {
                const currentKey = `${x},${y}`;
                if (currentKey === headCoord) {
                    row += 'H';
                } else if (bodyCoords.includes(currentKey)) {
                    row += 'o';
                } else {
                    row += '.';
                }
                row += ' ';
            }
            row += '|';
            output += row + '\n';
        }
        output += '-'.repeat(width * 2 + 2);
        console.log(output);
    }
}