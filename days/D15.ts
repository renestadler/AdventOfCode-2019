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
        let computer = new IntCodeComputer(inputs, 1);

        let field: number[][] = [];
        for (let i = 0; i < 41; i++) {
            field[i] = [];
            for (let j = 0; j < 41; j++) {
                field[i][j] = -1;
            }
        }
        let queue = [];
        queue.push({ curX: 21, curY: 21, steps: 0, computer: computer });
        field[21][21] = 1;
        let found = false;
        let delta = {
            1: { x: 0, y: -1 },
            2: { x: 0, y: 1 },
            3: { x: -1, y: 0 },
            4: { x: 1, y: 0 },
        };
        let steps;
        while (!found) {
            let current = queue.shift();
            if (field[current.curX][current.curY] != -1) {
                let currentProgram = current.computer;
                steps = current.steps + 1;
                for (let direction = 1; direction <= 4; direction++) {
                    let newX = current.curX + delta[direction].x;
                    let newY = current.curY + delta[direction].y;
                    let newProgram = currentProgram.clone();
                    let output = newProgram.compute([direction])[0];
                    field[newX][newY] = output;
                    if (output === 2) {
                        found = true;
                    }
                    else if (output === 1) {
                        if (field[newX][newY] !== -1) {
                            if (!queue.find(q => q.curX == newX && q.curY == newY)) {
                                queue.push({ curX: newX, curY: newY, steps: steps, computer: newProgram });
                            }
                        }
                    }
                }
            }
        }
        return steps;
    }

    public static part2(inputs: string[]) {
        if (inputs[0] == '') {
            return 0;
        }
        let computer = new IntCodeComputer(inputs, 1);

        let field = [];
        for (let i = 0; i < 41; i++) {
            field[i] = [];
            for (let j = 0; j < 41; j++) {
                field[i][j] = { value: -1, visited: false };
            }
        }
        let queue = [];
        queue.push({ curX: 21, curY: 21, computer: computer });
        field[21][21] = { value: 1, visited: true };
        let delta = {
            1: { x: 0, y: -1 },
            2: { x: 0, y: 1 },
            3: { x: -1, y: 0 },
            4: { x: 1, y: 0 },
        };
        let ventX;
        let ventY;
        while (queue.length > 0) {
            let current = queue.shift();
            if (field[current.curX][current.curY].value != -1) {
                let currentProgram = current.computer;
                for (let direction = 1; direction <= 4; direction++) {
                    let newX = current.curX + delta[direction].x;
                    let newY = current.curY + delta[direction].y;
                    let newProgram = currentProgram.clone();
                    let output = newProgram.compute([direction])[0];
                    if (output === 2) {
                        ventX = newX;
                        ventY = newY;
                    }
                    if (output === 1 || output === 2) {
                        if (!field[newX][newY].visited) {
                            if (!queue.find(q => q.curX == newX && q.curY == newY)) {
                                queue.push({ curX: newX, curY: newY, computer: newProgram });
                            }
                        }
                    }
                    field[newX][newY] = { value: output, visited: true };
                }
            }
        }
        queue = [];
        queue.push({ curX: ventX, curY: ventY, minutes: -1 });
        field[ventX][ventY].visited = false;
        field[ventX][ventY].value = 3;
        let maxMinutes = 0;
        while (queue.length > 0) {
            let current = queue.shift();
            let curMinutes = current.minutes + 1;
            if (maxMinutes < curMinutes) {
                maxMinutes = curMinutes;
            }
            for (let direction = 1; direction <= 4; direction++) {
                let newX = current.curX + delta[direction].x;
                let newY = current.curY + delta[direction].y;
                if (field[newX][newY].visited) {
                    field[newX][newY].visited = false;
                    if (field[newX][newY].value == 1) {
                        field[newX][newY].value = 3;
                        if (!queue.find(q => q.curX == newX && q.curY == newY)) {
                            queue.push({ curX: newX, curY: newY, minutes: curMinutes });
                        }
                    }
                }
            }
        }
        return maxMinutes;
    }

    public static printField(field) {
        let s = "";
        console.clear();
        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j < field[i].length; j++) {
                const element = field[i][j];
                switch (element.value) {
                    case -1: s += " "; break;
                    case 0: s += "█"; break;
                    case 1: s += "."; break;
                    case 2: s += "D"; break;
                    case 3: s += "O"; break;
                    default: s += element.value; break;
                }
            }
            s += "\n";
        }
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

    public clone(): IntCodeComputer {
        let computer = new IntCodeComputer(["1", "2"], 1);
        computer.numOutputs = this.numOutputs;
        computer.relativeBase = this.relativeBase;
        computer.done = this.done;
        computer.index = this.index;
        let ar: number[] = [];
        for (let i = 0; i < this.stack.length; i++) {
            ar[i] = this.stack[i];
        }
        computer.stack = ar;
        return computer;
    }

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