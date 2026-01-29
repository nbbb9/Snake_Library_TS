import { GameEngine } from '../core/GameEngine';
import { GameStatus } from '../enums/GameStatus';
import { FoodType } from "../enums/FoodType";

export class ConsoleDebugger {
    // 엔진을 주입받는다 (Dependency Injection)
    constructor(private engine: GameEngine) {}

    print(stepName: string = ''): void {
        const board = this.engine.board;
        const snake = this.engine.snake;
        const food = this.engine.food;
        const width = board.width;
        const height = board.height;
        const boardOutputWidth = (width * 2) + 2; // 보드 가로 길이 (문자열 기준)
        const terminalWidth = process.stdout.columns || 80; // 터미널 전체 폭
        const leftPaddingSize = Math.max(0, Math.floor((terminalWidth - boardOutputWidth - 25) / 2));
        const padding = ' '.repeat(leftPaddingSize);

        // 뱀, 먹이 좌표 데이터 준비
        const bodyCoords = snake.body.map(p => `${p.x},${p.y}`);
        const headCoord = `${snake.head.x},${snake.head.y}`;
        let foodCoord = "";
        if (food) {
            foodCoord = `${food.position.x},${food.position.y}`;
        }

        const currentScore = this.engine.score;
        // 각 줄(y)마다 오른쪽에 표시할 텍스트를 배열로 정의
        const sidebarLines: string[] = [
            `  📊 [ STATUS BOARD ]`,
            `  -------------------`,
            `  🍎 먹은 개수 : ${currentScore}`,
            `  ❤️ 현재 길이 : ${snake.body.length}`,
            `  -------------------`,
            `  📍 머리 좌표 : (${snake.head.x}, ${snake.head.y})`,
            `  🕹️  상태     : ${GameStatus[this.engine.status]}`,
        ];

        // --- 출력 문자열 생성 시작 ---
        let output = `\n${padding}--- [ Snake Game ] ---\n`;

        // y축 루프 (세로)
        for (let y = 0; y < height; y++) {
            let row = padding + '|'; // 왼쪽 여백 + 벽
            // x축 루프 (가로) - 보드 그리기
            for (let x = 0; x < width; x++) {
                const currentKey = `${x},${y}`;
                let cell = '';
                if (currentKey === headCoord) {
                    cell = 'H ';
                } else if (food && currentKey === foodCoord) {
                    cell = (food.type === FoodType.GROW) ? '🍎' : '🍄';
                } else if (bodyCoords.includes(currentKey)) {
                    cell = 'o ';
                } else {
                    cell = '. ';
                }
                row += cell;
            }
            row += '|'; // 오른쪽 벽
            if (sidebarLines[y]) {
                row += sidebarLines[y];
            }
            output += row + '\n';
        }
        // 바닥 그리기
        output += padding + '-'.repeat(boardOutputWidth);
        // 최종 출력
        console.log(output);
    }
}