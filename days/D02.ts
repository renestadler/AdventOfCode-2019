export class Main {
    public static start(input: string) {
        let answer1 = this.part1(input.split(','));
        let answer2 = this.part2(input.split(','));
        return [answer1, answer2];
    }

    public static part1(inputs: string[]) {
        var stack = inputs.map(f => parseInt(f));
        let index = 0;
        stack[1] = 12;
        stack[2] = 2;
        while (stack[index] <= 99) {
            switch (stack[index]) {
                case 1: stack[stack[index + 3]] = stack[stack[index + 1]] + stack[stack[index + 2]]; break;
                case 2: stack[stack[index + 3]] = stack[stack[index + 1]] * stack[stack[index + 2]]; break;
            }
            index += 4;
        }
        return stack[0];
    }

    public static part2(inputs: string[]) {
        for (let index1 = 0; index1 < 100; index1++) {
            for (let index2 = 0; index2 < 100; index2++) {
                var stack = inputs.map(f => parseInt(f));
                let index = 0;
                stack[1] = index1;
                stack[2] = index2;
                while (stack[index] <= 99) {
                    switch (stack[index]) {
                        case 1: stack[stack[index + 3]] = stack[stack[index + 1]] + stack[stack[index + 2]]; break;
                        case 2: stack[stack[index + 3]] = stack[stack[index + 1]] * stack[stack[index + 2]]; break;
                    }
                    index += 4;
                }
                if (stack[0] == 19690720) {
                    return 100 * index1 + index2;
                }
            }
        }
    }
}