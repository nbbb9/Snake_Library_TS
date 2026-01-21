import { describe, it, expect } from 'vitest';
import { Position } from '../src/value-objects/Position';

// 1. describe: 테스트 그룹 (Java의 테스트 클래스 이름)
describe('Position 객체', () => {

    // 2. it: 개별 테스트 케이스 (Java의 @Test 메서드)
    it('같은 좌표를 가진 두 객체는 동등해야 한다', () => {

        // Given (상황): (10, 10) 좌표 두 개를 만듦
        const pos1 = new Position(10, 10);
        const pos2 = new Position(10, 10);

        // When (행동): 두 객체가 같은지 물어봄 (isEqual)
        const result = pos1.isEqual(pos2);

        // Then (검증): 결과가 true여야 한다 (Java의 assertTrue)
        expect(result).toBe(true);
    });
});