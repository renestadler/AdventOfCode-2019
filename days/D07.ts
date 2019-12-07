export class Main {
    public static async start(input: string) {
        let answer1 = this.part1(input.split(','));
        let answer2 = await this.part2(input.split(','));
        return [answer1, answer2];
    }

    public static unblock = () => new Promise(setImmediate);

    public static permutation = (ar: number[]): number[][] =>
        ar.length === 1 ? ar :
            ar.reduce((ac, _, i) => {
                Main.permutation([...ar.slice(0, i), ...ar.slice(i + 1)]).map(v => ac.push([].concat(ar[i], v)));
                return ac;
            }, []
            );


    public static compute = async (source: string[], inputs: number[], outputs: number[], phaseSettings: number[]) => {
        const stack = source.map(Number);
        let index = 0;
        loop:
        while (true) {
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
                    if (phaseSettings.length > 0) {
                        stack[stack[index + 1]] = phaseSettings.shift();
                    } else if (inputs.length > 0) {
                        stack[stack[index + 1]] = inputs.shift();
                    } else {
                        await Main.unblock();
                        break;
                    }
                    index += 2;
                    break;
                case 4:
                    let output = modes[0] == 0 ? stack[stack[index + 1]] : stack[index + 1];
                    outputs.push(output);
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
                    break loop;
            }
        }
        return outputs;
    }

    public static part1(inputs: string[]) {
        if (inputs[0] == '') {
            return -1;
        }
        let max = 0;
        Main.permutation([0, 1, 2, 3, 4]).forEach(element => {
            let output1 = 0;
            element.forEach(element => {
                let output = [];
                this.compute(inputs, [output1], output, [element]);
                output1 = output[0];
                if (output1 > max) {
                    max = output1;
                }
            });
        });
        return max;
    }

    public static async part2(inputs: string[]) {
        if (inputs[0] == '') {
            return -1;
        }
        let max = 0;
        let elements = Main.permutation([5, 6, 7, 8, 9]);
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const out1 = [];
            const out2 = [];
            const out3 = [];
            const out4 = [];
            const out5 = [0];
            await Promise.all([
                Main.compute(inputs, out5, out1, [element[0]]),
                Main.compute(inputs, out1, out2, [element[1]]),
                Main.compute(inputs, out2, out3, [element[2]]),
                Main.compute(inputs, out3, out4, [element[3]]),
                Main.compute(inputs, out4, out5, [element[4]]),
            ]);
            let number = Math.max(...out5);
            if (number > max) {
                max = number;
            }
        };
        return max;
    }

}