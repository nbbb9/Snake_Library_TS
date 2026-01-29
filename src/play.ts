import readline from 'readline';
import { GameEngine } from './core/GameEngine';
import { GameStatus } from './enums/GameStatus';
import { Direction } from './enums/Direction';
import { Position } from './value-objects/Position';
import { ConsoleDebugger } from './utils/ConsoleDebugger';
import { SoundPlayer } from './utils/SoundPlayer';

// --- [설정] ---
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 10;
const GAME_SPEED_MS = 500; // Auto 모드 속도

const soundPlayer = new SoundPlayer(); // 음악 재생 객체

// 엔진 및 디버거 초기화
const engine = new GameEngine(
    BOARD_WIDTH,
    BOARD_HEIGHT,
    new Position(5, 5),
    Direction.RIGHT,
    3,
    soundPlayer
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
        soundPlayer.stopBgm(); // 음악 정지
        console.log("\n종료합니다.");
        process.exit();
    }
    // 메뉴 선택 단계 (게임 시작 전)
    if (currentMode === 'NONE') {
        if (key.name === '1') {
            startAutoMode();
        } else if (key.name === '2') {
            startManualMode();
        }
        return;
    }
    // 게임 진행 중
    const inputDir = mapKeyToDirection(key.name);

    if (currentMode === 'AUTO') {
        // Auto 모드: 키 입력은 '다음 방향 예약'만 함
        if (inputDir !== undefined) {
            nextAutoDirection = inputDir;
        }
    } else if (currentMode === 'MANUAL') {
        // Manual 모드: 키 입력 즉시 1턴 진행
        if (inputDir !== undefined) {
            runGameStep(inputDir); // 입력한 방향으로 즉시 이동
        } else {
            // 방향키가 아닌 다른 키를 누르면
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
    console.log("      - 자동 직진");
    console.log("      - 방향키로 방향만 전환");
    console.log("");
    console.log("   2. Manual Mode (Turn-based)");
    console.log("      - 수동 전진");
    console.log("      - 방향키를 눌러야 한 칸 이동");
    console.log("");
    console.log("=================================");
    console.log("Press '1' or '2' to start...");
}

// Auto 모드 실행 (타이머 사용)
function startAutoMode() {
    currentMode = 'AUTO';
    soundPlayer.playBgm('audios/bgm.mp3', 0.5);
    engine.start();

    // 주기적으로 실행 (게임 루프)
    const timer = setInterval(() => {
        if (engine.status === GameStatus.GAME_OVER) {
            clearInterval(timer);
            return;
        }

        runGameStep(nextAutoDirection);
        nextAutoDirection = undefined; // 입력 초기화

    }, GAME_SPEED_MS);
}

// Manual 모드 실행 (타이머 없음, 이벤트 기반)
function startManualMode() {
    currentMode = 'MANUAL';
    soundPlayer.playBgm('audios/bgm.mp3', 0.5);
    engine.start();
    console.clear();
    debugView.print("👤 수동모드 : 방향키로 움직일 수 있습니다.");
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
        soundPlayer.stopBgm(); // 종료시 음악 정지
        soundPlayer.playSfx('audios/gameover.mp3', 0.2);
        console.log("\n💀 GAME OVER! 💀");
        setTimeout(() => {
            process.exit();
        }, 3000);
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