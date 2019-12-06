export class Main {
    public static start(input: string) {
        let answer1 = this.part1(input.split(','));
        let answer2 = this.part2(input.split(','));
        return [answer1, answer2];
    }

    public static part1(inputs: string[]) {
        var stack = inputs.map(f => parseInt(f));
        let index = 0;
        let done = false;
        while (!done) {

            let modes = [];
            modes[0] = Math.floor(stack[index] / 100) % 10;
            modes[1] = Math.floor(stack[index] / 1000) % 10;
            modes[2] = Math.floor(stack[index] / 10000) % 10;
            switch (stack[index] > 99 ? stack[index] % 100 : stack[index]) {
                case 1:
                    let v1 = modes[0] == 0 ? stack[stack[index + 1]] : stack[index + 1];
                    let v2 = modes[1] == 0 ? stack[stack[index + 2]] : stack[index + 2];
                    stack[stack[index + 3]] = v1 + v2;
                    index += 4;
                    break;
                case 2:
                    v1 = modes[0] == 0 ? stack[stack[index + 1]] : stack[index + 1];
                    v2 = modes[1] == 0 ? stack[stack[index + 2]] : stack[index + 2];
                    stack[stack[index + 3]] = v1 * v2;
                    index += 4;
                    break;
                case 3:
                    stack[stack[index + 1]] = 1;
                    index += 2;
                    break;
                case 4:
                    let output = modes[0] == 0 ? stack[stack[index + 1]] : stack[index + 1];
                    if (output != 0) {
                        return output;
                    }
                    index += 2;
                    break;
                case 99:
                    done = true;
                    break;
                default:
                    done = true;
                    console.log("Error: " + stack[index]);
            }
        }
    }

    public static part2(inputs: string[]) {
        var stack = inputs.map(f => parseInt(f));
        let index = 0;
        let done = false;
        while (!done) {
            let modes = [];
            modes[0] = Math.floor(stack[index] / 100) % 10;
            modes[1] = Math.floor(stack[index] / 1000) % 10;
            modes[2] = Math.floor(stack[index] / 10000) % 10;
            switch (stack[index] > 99 ? stack[index] % 100 : stack[index]) {
                case 1:
                    let v1 = modes[0] == 0 ? stack[stack[index + 1]] : stack[index + 1];
                    let v2 = modes[1] == 0 ? stack[stack[index + 2]] : stack[index + 2];
                    stack[stack[index + 3]] = v1 + v2;
                    index += 4;
                    break;
                case 2:
                    v1 = modes[0] == 0 ? stack[stack[index + 1]] : stack[index + 1];
                    v2 = modes[1] == 0 ? stack[stack[index + 2]] : stack[index + 2];
                    stack[stack[index + 3]] = v1 * v2;
                    index += 4;
                    break;
                case 3:
                    stack[stack[index + 1]] = 5;
                    index += 2;
                    break;
                case 4:
                    let output = modes[0] == 0 ? stack[stack[index + 1]] : stack[index + 1];
                    if (output != 0) {
                        return output;
                    }
                    index += 2;
                    break;
                case 5:
                    let doJump = modes[0] == 0 ? stack[stack[index + 1]] : stack[index + 1];
                    if (doJump != 0) {
                        index = modes[1] == 0 ? stack[stack[index + 2]] : stack[index + 2];
                    } else {
                        index += 3;
                    }
                    break;
                case 6:
                    doJump = modes[0] == 0 ? stack[stack[index + 1]] : stack[index + 1];
                    if (doJump == 0) {
                        index = modes[1] == 0 ? stack[stack[index + 2]] : stack[index + 2];
                    } else {
                        index += 3;
                    }
                    break;
                case 7:
                    v1 = modes[0] == 0 ? stack[stack[index + 1]] : stack[index + 1];
                    v2 = modes[1] == 0 ? stack[stack[index + 2]] : stack[index + 2];
                    if (v1 < v2) {
                        stack[stack[index + 3]] = 1;
                    } else {
                        stack[stack[index + 3]] = 0;
                    }
                    index += 4;
                    break;
                case 8:
                    v1 = modes[0] == 0 ? stack[stack[index + 1]] : stack[index + 1];
                    v2 = modes[1] == 0 ? stack[stack[index + 2]] : stack[index + 2];
                    if (v1 == v2) {
                        stack[stack[index + 3]] = 1;
                    } else {
                        stack[stack[index + 3]] = 0;
                    }
                    index += 4;
                    break;
                case 99:
                    done = true;
                    break;
                default:
                    done = true;
                    console.log("Error: " + stack[index]);
            }
        }
    }
}