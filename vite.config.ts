import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
    build: {
        lib: {
            // 1. 진입점: 이 파일을 시작으로 연관된 모든 파일을 찾습니다.
            entry: path.resolve(__dirname, 'src/index.ts'),

            // 2. 라이브러리 이름
            name: 'Snake_lib',

            // 3. 생성될 파일 이름 규칙 (index.es.js, index.umd.js 등)
            fileName: (format) => `index.${format}.js`
        },
        // 빌드 결과물이 나올 폴더 (기본값이 dist지만 명시적으로 적음)
        outDir: 'dist',
        // 소스맵 생성 (디버깅 용이)
        sourcemap: true,
        // 기존 빌드 결과 삭제 후 새로 빌드
        emptyOutDir: true,
    },
    plugins: [
        // .d.ts 파일을 생성해주는 플러그인
        dts({
            insertTypesEntry: true,
        }),
    ],
});