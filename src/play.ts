import readline from 'readline';
import { GameEngine } from './core/GameEngine';
import { GameStatus } from './core/GameStatus';
import { Direction } from './value-objects/Direction';
import { Position } from './value-objects/Position';
import { ConsoleDebugger } from './utils/ConsoleDebugger';

// --- [설정] ---
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 10;
const GAME_SPEED_MS = 500; // Auto 모드 속도

// 엔진 및 디버거 초기화
const engine = new GameEngine(
    BOARD_WIDTH,
    BOARD_HEIGHT,
    new Position(5, 5),
    Direction.RIGHT,
    3
);

const debugView = new ConsoleDebugger(engine);

// 키 입력 설정
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}

// 상태 관리
type GameMode = 'NONE' | 'AUTO' | 'MANUAL'; // 게임 모드
let currentMode: GameMode = 'NONE';
let nextAutoDirection: Direction | undefined = undefined; // Auto 모드용 입력 버퍼

// --- [메인 로직: 키보드 이벤트 핸들러] ---
process.stdin.on('keypress', (str, key) => {
    // 공통: Ctrl+C 종료
    if (key.ctrl && key.name === 'c') {
        console.log("\n종료합니다.");
        process.exit();
    }

    // A. 메뉴 선택 단계 (게임 시작 전)
    if (currentMode === 'NONE') {
        if (key.name === '1') {
            startAutoMode();
        } else if (key.name === '2') {
            startManualMode();
        }
        return;
    }

    // B. 게임 진행 중
    const inputDir = mapKeyToDirection(key.name);

    if (currentMode === 'AUTO') {
        // Auto 모드: 키 입력은 '다음 방향 예약'만 함 (이동은 타이머가 함)
        if (inputDir !== undefined) {
            nextAutoDirection = inputDir;
        }
    } else if (currentMode === 'MANUAL') {
        // Manual 모드: 키 입력 즉시 1턴 진행 (Turn-Based)
        if (inputDir !== undefined) {
            runGameStep(inputDir); // 입력한 방향으로 즉시 이동
        } else {
            // 방향키가 아닌 다른 키를 누르면? (선택사항: 무시하거나 가던 방향으로 이동)
            // 여기서는 아무 반응 안 함.
        }
    }
});

// 초기 메뉴 출력
printMenu();

// --- [함수 정의] ---
function printMenu() {
    console.clear();
    console.log("=================================");
    console.log("   🐍 SNAKE GAME ENGINE DEMO 🐍   ");
    console.log("=================================");
    console.log("");
    console.log("   1. Auto Mode (Real-time)");
    console.log("      - 저절로 움직임");
    console.log("      - 방향키로 방향만 전환");
    console.log("");
    console.log("   2. Manual Mode (Turn-based)");
    console.log("      - 가만히 멈춰있음");
    console.log("      - 방향키를 눌러야 한 칸 이동");
    console.log("");
    console.log("=================================");
    console.log("Press '1' or '2' to start...");
}

// 1. Auto 모드 실행 (타이머 사용)
function startAutoMode() {
    currentMode = 'AUTO';
    engine.start();

    // 주기적으로 실행 (게임 루프)
    const timer = setInterval(() => {
        if (engine.status === GameStatus.GAME_OVER) {
            clearInterval(timer);
            return;
        }

        // 봇 로직 (입력이 없으면 30% 확률로 랜덤)
        if (nextAutoDirection === undefined && Math.random() < 0.3) {
            // 봇이 랜덤하게 움직이게 하려면 여기서 nextAutoDirection 설정
            // (사용자가 조작하는 느낌을 주려면 이 부분 제거하면 됨)
            // 여기서는 '자동 직진'이 기본이므로, 그냥 둡니다.
        }

        runGameStep(nextAutoDirection);
        nextAutoDirection = undefined; // 입력 초기화

    }, GAME_SPEED_MS);
}

// 2. Manual 모드 실행 (타이머 없음, 이벤트 기반)
function startManualMode() {
    currentMode = 'MANUAL';
    engine.start();

    // 첫 화면 그리기 (아직 안 움직임)
    console.clear();
    debugView.print("👤 Manual Mode: Press Arrow Keys to Move");
}

// 공통: 게임 로직 한 단계 실행 및 화면 갱신
function runGameStep(dir?: Direction) {
    console.clear();

    // 엔진 실행
    engine.step(dir);

    // 화면 그리기
    const modeTitle = currentMode === 'AUTO' ? "🤖 Auto Mode" : "👤 Manual Mode";
    debugView.print(`${modeTitle} (Ctrl+C to Exit)`);

    // 게임 오버 체크
    if (engine.status === GameStatus.GAME_OVER) {
        console.log("\n💀 GAME OVER! 💀");
        process.exit();
    }
}

// 키 이름을 Direction Enum으로 변환
function mapKeyToDirection(keyName: string): Direction | undefined {
    switch (keyName) {
        case 'up':    return Direction.UP;
        case 'down':  return Direction.DOWN;
        case 'left':  return Direction.LEFT;
        case 'right': return Direction.RIGHT;
        default: return undefined;
    }
}