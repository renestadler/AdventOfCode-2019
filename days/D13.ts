let readlineSync = require('readline-sync');

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
        let computer = new IntCodeComputer(inputs, 3);
        let output = [];
        while (!computer.done) {
            output.push(computer.compute([]));
        }
        let count = 0;
        for (let i = 0; i < output.length; i++) {
            const element = output[i];
            if (output[i][2] == 2) {
                count++;
            }
        }
        return count;
    }

    public static part2(inputs: string[]) {
        if (inputs[0] == '') {
            return 0;
        }
        inputs[0] = '2';
        let ar = [];
        for (let i = 0; i < 22; i++) {
            ar[i] = [];
        }
        let computer = new IntCodeComputer(inputs, 3);
        let input = [];
        let score = 0;
        let initDone = false;
        let ball = 0;
        let bar = 0;
        while (!computer.done) {
            let cur = computer.compute(input);
            if (cur[0] == -1 && cur[1] == 0) {
                initDone = true;
                score = cur[2];
            } else if (cur[0] == undefined && cur[1] == undefined) {
                return score;
            } else {
                ar[cur[1]][cur[0]] = cur[2];
            }
            if (initDone) {
                if (cur[2] == 4) {
                    ball = cur[0];
                    if (ball > bar) {
                        input.push(1);
                    } else if (ball < bar) {
                        input.push(-1);
                    }
                    else {
                        input.push(0);
                    }
                } if (cur[2] == 3) {
                    bar = cur[0];
                }
            }
            //this.printField(ar);
        }
        /*
        let ar = [];
        for (let i = 0; i < 22; i++) {
            ar[i] = [];
        }
        for (let i = 0; i < output.length; i++) {
            ar[output[i][1]][output[i][0]] = output[i][2];
        }*/
        return score;
    }

    public static printField(field: number[][]) {
        let s = '';
        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j < field[i].length; j++) {
                switch (field[i][j]) {
                    case 0: s += ' '; break;
                    case 1: s += '█'; break;
                    case 2: s += '▀'; break;
                    case 3: s += '▅'; break;
                    case 4: s += '⏺'; break;
                    default: s += field[i][j];
                }
            }
            s += '\n';
        }
        console.clear();
        console.log(s);
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