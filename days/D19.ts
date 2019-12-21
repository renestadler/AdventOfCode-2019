export class Main {
    public static start(input: string) {
        let answer1 = this.part1(input.split(','));
        let answer2 = this.part2(input.split(','));
        return [answer1, answer2];
    }

    public static part1(inputs: string[]) {
        if (inputs[0] == '') {
            return 0;
        }
        let output = [];
        let ar = [];
        for (let i = 0; i < 50; i++) {
            ar[i] = [];
            for (let j = 0; j < 50; j++) {
                let computer = new IntCodeComputer(inputs, 1);
                let ar1 = computer.compute([i, j]);
                ar[i][j] = ar1[0];
            }
        }
        let count = 0;
        ar.forEach(a => a.forEach(a1 => a1 == 1 ? count++ : count));
        return count;
    }

    public static part2(inputs: string[]) {
        if (inputs[0] == '') {
            return 0;
        }
        const size = 100;
        const from = 500;
        const to = 1500;

        for (let y = from; y < to; y++) {
            for (let x = from; x < to; x++) {
                let computer = new IntCodeComputer(inputs, 1);
                const [a] = computer.compute([x, y]);
                if (!a) continue
                computer = new IntCodeComputer(inputs, 1);
                const [b] = computer.compute([x + size - 1, y])
                if (!b) continue
                computer = new IntCodeComputer(inputs, 1);
                const [c] = computer.compute([x, y + size - 1])
                if (!c) continue
                return x * 10000 + y;
            }
        }
    }
}

class IntCodeComputer {
    constructor(source: string[], numOutputs: number) {
        this.stack = source.map(Number);
        this.numOutputs = numOutputs;
    }
    private stack;
    private index = 0;
    private relativeBase = 0;
    private numOutputs;
    public done = false;


    public compute = (inputs: number[]) => {
        let outputs = [];
        let operationIndex;
        let operation;
        let increase = 4;
        let i;
        loop:
        for (i = this.index; i < this.stack.length; i += increase) {
            let cur = this.stack[i];
            let opcode = cur % 100;
            let mode1 = (cur - opcode) % 1000 / 100;
            let mode2 = (cur - mode1 * 100 - opcode) % 10000 / 1000;
            let mode3 = (cur - mode2 * 1000 - mode1 * 100 - opcode) % 100000 / 10000;
            let val1 = (mode1 == 0 ?
                this.stack[this.stack[i + 1]] : mode1 == 1 ?
                    this.stack[i + 1] :
                    this.stack[this.stack[i + 1] + this.relativeBase]);
            let val2 = (mode2 == 0 ?
                this.stack[this.stack[i + 2]] : mode2 == 1 ?
                    this.stack[i + 2] :
                    this.stack[this.stack[i + 2] + this.relativeBase]);
            let val3 = (mode3 == 0 ?
                this.stack[this.stack[i + 3]] : mode3 == 1 ?
                    this.stack[i + 3] :
                    this.stack[this.stack[i + 3] + this.relativeBase]);


            if (val1 == undefined) {
                val1 = 0;
            }
            if (val2 == undefined) {
                val2 = 0;
            }
            if (val3 == undefined) {
                val3 = 0;
            }
            if (opcode == 1 || opcode == 2 || opcode == 7 || opcode == 8) {
                if (mode3 == 2) {
                    operationIndex = this.stack[i + 3] + this.relativeBase;
                } else {
                    operationIndex = this.stack[i + 3];
                }
            } else if (opcode == 3) {
                if (mode1 == 2) {
                    operationIndex = this.stack[i + 1] + this.relativeBase;
                } else {
                    operationIndex = this.stack[i + 1];
                }
            }
            switch (opcode) {
                case 1:
                    operation = val1 + val2;
                    increase = 4;
                    break;
                case 2:
                    operation = val1 * val2;
                    increase = 4;
                    break;
                case 3:
                    operation = inputs.shift();
                    increase = 2;
                    break;
                case 4:
                    outputs.push(val1);
                    increase = 2;
                    break;
                case 5:
                    if (val1 != 0) {
                        i = val2;
                        increase = 0;
                    } else {
                        increase = 3;
                    }
                    break;
                case 6:
                    if (val1 == 0) {
                        i = val2;
                        increase = 0;
                    } else {
                        increase = 3;
                    }
                    break;
                case 7:
                    if (val1 < val2) {
                        operation = 1;
                    } else {
                        operation = 0;
                    }
                    increase = 4;
                    break;
                case 8:
                    if (val1 == val2) {
                        operation = 1;
                    } else {
                        operation = 0;
                    }
                    increase = 4;
                    break;
                case 9:
                    this.relativeBase += val1;
                    increase = 2;
                    break;
            }
            if (opcode == 1 || opcode == 2 || opcode == 3 || opcode == 7 || opcode == 8) {
                this.stack[operationIndex] = operation;
            }
            if (opcode == 99) {
                this.done = true;
                break;
            } if (opcode == 4 && outputs.length == this.numOutputs) { //pause if instruction is an output and pausecount is reached
                break;
            }
        }
        this.index = i += increase;
        return outputs;
    }
}