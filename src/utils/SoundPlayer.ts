import player from 'play-sound';
import path from 'path';
import { ISoundPlayer } from '../interfaces/ISoundPlayer';

export class SoundPlayer implements ISoundPlayer {
    private player = player({});
    private bgmProcess: any = null; // BGM만 따로 관리하는 변수

    /**
     * 배경음악 재생 (BGM)
     */
    playBgm(fileName: string, volume: number = 0.3): void {
        // 이미 BGM이 나오고 있다면 중복 재생 방지
        if (this.bgmProcess) return;

        const filePath = path.join(process.cwd(), fileName);
        const options = { afplay: ['-v', volume] };

        // BGM 프로세스는 변수에 꼭 저장해야 나중에 끌 수 있음
        this.bgmProcess = this.player.play(filePath, options, (err: any) => {
            if (err && !err.killed) {
                // console.error("BGM 재생 에러:", err);
            }
            // 노래가 끝나면(혹은 꺼지면) 변수 초기화
            if (err && err.killed) return;
            this.bgmProcess = null;
        });
    }

    /**
     * 배경음악 정지
     */
    stopBgm(): void {
        if (this.bgmProcess) {
            this.bgmProcess.kill(); // 저장해둔 BGM 프로세스 제거
            this.bgmProcess = null;
        }
    }

    /**
     * 효과음 재생 (SFX)
     */
    playSfx(fileName: string, volume: number = 0.8): void {
        const filePath = path.join(process.cwd(), fileName);
        const options = { afplay: ['-v', volume] };

        // 효과음은 변수에 저장하지 않는다. (BGM 변수를 덮어쓰지 않기 위해) 실행하고 제거
        this.player.play(filePath, options, (err: any) => {
            if (err && !err.killed) {
                // console.error("효과음 재생 에러:", err);
            }
        });
    }
}