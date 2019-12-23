export class Main {
    public static async start(input: string) {
        let answer1 = await this.part1(input.split(','));
        let answer2 = await this.part2(input.split(','));
        return [answer1, answer2];
    }

    public static async part1(input: string[]) {
        if (input[0] == '') {
            return 0;
        }

        const inputBuffers = Array.from({ length: 50 }, () => []);
        const outputBuffers = Array.from({ length: 50 }, () => []);
        let computers: IntCodeComputer[] = [];

        inputBuffers.forEach((inputs, i) => {
            inputs.push(i);
            let computer = new IntCodeComputer(input, 0);
            computer.compute(inputs, outputBuffers[i]);
            computers.push(computer);
        });
        while (true) {
            await unblock();
            let packets = outputBuffers.map((buffer) => chunkArray(buffer, 3));
            packets = [].concat.apply([], packets);

            const address255 = packets.find((x) => x[0] === 255);

            if (address255 !== undefined) {
                computers.forEach(c => c.done = true);
                return address255[2];
            }

            outputBuffers.forEach((buffer) => {
                const out = [];
                while (buffer.length > 0) {
                    out.push(buffer.shift());
                }

                chunkArray(out, 3).forEach(([address, X, Y]) => {
                    inputBuffers[address].push(X);
                    inputBuffers[address].push(Y);
                });
            });

            inputBuffers.forEach((buffer) => buffer.length === 0 && buffer.push(-1));
        }
    }

    public static async part2(input: string[]) {
        if (input[0] == '') {
            return 0;
        }

        const inputBuffers = Array.from({ length: 50 }, () => []);
        const outputBuffers = Array.from({ length: 50 }, () => []);
        let computers: IntCodeComputer[] = [];

        inputBuffers.forEach((inputs, i) => {
            inputs.push(i);
            let computer = new IntCodeComputer(input, 0);
            computer.compute(inputs, outputBuffers[i]);
            computers.push(computer);
        });

        let prevNat = [-1, -1];
        let nat = [];

        while (true) {
            await unblock();

            if (inputBuffers.every((x) => x.length === 0) &&
                outputBuffers.every((x) => x.length === 0)) {
                inputBuffers[0].push(nat[0]);
                inputBuffers[0].push(nat[1]);
            }

            if (nat[1] === prevNat[1]) {
                computers.forEach(c => c.done = true);
                return nat[1];
            }

            outputBuffers.forEach((buffer) => {
                const out = [];
                while (buffer.length > 0) {
                    out.push(buffer.shift());
                }

                chunkArray(out, 3).forEach(([address, X, Y]) => {
                    if (address === 255) {
                        prevNat = nat;
                        nat = [X, Y];
                    } else {
                        inputBuffers[address].push(X);
                        inputBuffers[address].push(Y);
                    }
                });
            });

            inputBuffers.forEach((buffer) => buffer.length === 0 && buffer.push(-1));
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


    public compute = async (inputs: number[], outputs: number[]) => {
        let operationIndex;
        let operation;
        let increase = 4;
        let i;
        loop:
        for (i = this.index; i < this.stack.length; i += increase) {
            if (this.done) {
                return NaN;
            }
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
                if (inputs.length == 0) {
                } else {
                    if (mode1 == 2) {
                        operationIndex = this.stack[i + 1] + this.relativeBase;
                    } else {
                        operationIndex = this.stack[i + 1];
                    }
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
                    if (inputs.length == 0) {
                        await unblock();
                    } else {
                        operation = inputs.shift();
                        increase = 2;
                    }
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
                case 10:
                    return [NaN];
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

const unblock = () => new Promise(setImmediate);

function chunkArray(myArray, chunk_size) {
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];

    for (index = 0; index < arrayLength; index += chunk_size) {
        let myChunk = myArray.slice(index, index + chunk_size);
        // Do something if you want with the group
        tempArray.push(myChunk);
    }

    return tempArray;
}