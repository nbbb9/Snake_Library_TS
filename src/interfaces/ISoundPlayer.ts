export interface ISoundPlayer {
    /** 배경음악 재생 (반복, 지속) */
    playBgm(fileName: string, volume?: number): void;
    /** 배경음악 정지 */
    stopBgm(): void;
    /** 효과음 재생 (단발성, 중복 가능) */
    playSfx(fileName: string, volume?: number): void;
}