
// 게임의 진행 단계
export enum GameStatus {
    READY,      // 게임 시작 대기 중 (아직 움직이지 않음)
    PLAYING,    // 게임 진행 중
    GAME_OVER   // 게임 종료 (벽 충돌, 자기 몸 충돌 등)
}