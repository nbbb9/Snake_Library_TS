
export class Position {
    // 생성자(constructor)에서 'public readonly'를 쓰면 멤버 변수 선언과 초기가 동시에 가능하다.
    constructor(
        public readonly x: number,
        public readonly y: number
    ) {}

    // Java의 equals() 오버라이딩과 같다.
    // 객체 주소값이 아닌 실제 좌표값으로 비교하기 위함.
    isEqual(other: Position): boolean {
        return this.x === other.x && this.y === other.y;
    }
}