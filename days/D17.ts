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
        let computer = new IntCodeComputer(inputs, 46);
        let output = [];
        while (!computer.done) {
            let ar = computer.compute([]);
            ar.pop();
            output.push(ar);
        }
        let sum = 0;
        for (let i = 1; i < output.length - 2; i++) {
            for (let j = 1; j < output[i].length - 1; j++) {
                const element = output[i][j];
                if (element == 35 &&
                    element == output[i][j - 1] &&
                    element == output[i][j + 1] &&
                    element == output[i - 1][j] &&
                    element == output[i + 1][j]) {
                    sum += i * j;
                }
            }
        }
        return sum;
    }

    public static part2(inputs: string[]) {
        if (inputs[0] == '') {
            return 0;
        }
        inputs[0] = '2';
        let computer = new IntCodeComputer(inputs, 46);
        let output = [];
        let result;
        while (!computer.done) {

            let input = "A,B,A,C,A,B,A,C,B,C\nR,4,L,12,L,8,R,4\nL,8,R,10,R,10,R,6\nR,4,R,10,L,12\n";
            let asciiKeys = [];
            for (var i = 0; i < input.length; i++) {
                asciiKeys.push(input[i].charCodeAt(0));
            }
            let ar = computer.compute(asciiKeys);
             result=ar.pop();
            output.push(ar);
        }
        let s = "";
        for (let i = 0; i < output.length; i++) {
            for (let j = 0; j < output[i].length; j++) {
                s += String.fromCharCode(output[i][j]);
            }
            s += "\n";
        }
        return result;
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