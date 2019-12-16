export class Main {
    public static start(input: string) {
        let answer1 = this.part1(input.split(''));
        let answer2 = this.part2(input.split(''));
        return [answer1, answer2];
    }

    public static part1(inputs: string[]) {
        let numbers = inputs.map(Number);
        let pattern = [0, 1, 0, -1];
        for (let i = 0; i < 100; i++) {
            for (let j = 0; j < numbers.length; j++) {
                let element = 0;
                for (let k = 0; k < numbers.length; k++) {
                    element += numbers[k] *
                        pattern[Math.floor(((k + 1) % (4 * (j + 1))) / (j + 1))];
                }
                numbers[j] = Math.abs(element) % 10;
            }
        }
        return numbers.slice(0, 8).join("");
    }

    public static part2(inputs: string[]) {
        let input = inputs.map(Number);
        const offset = Number(input.slice(0, 7).join(""));
        const howOften = Math.ceil((input.length * 10000 - offset) / input.length);
        let numbers: number[] = [];
        for (let i = 0; i < howOften; i++) {
            numbers = numbers.concat(input);
        }
        numbers = numbers.slice(offset % input.length);

        for (let i = 0; i < 100; i++) {
            for (let j = numbers.length - 2; j >= 0; j--) {
                const element = numbers[j] + numbers[j + 1]
                numbers[j] = Math.abs(element) % 10
            }
        }
        return numbers.slice(0, 8).join("");
    }
}