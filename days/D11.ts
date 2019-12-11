import { unwatchFile } from "fs";
import { generateKeyPair } from "crypto";

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

        let robotx = 0;
        let roboty = 0;
        let dir = 'u';
        let points: Point[] = [];
        let visited = [];
        let ix, coords;
        let comp: IntCodeComputer = new IntCodeComputer(inputs, 2);

        while (!comp.done) {
            coords = robotx.toString() + ',' + roboty.toString();
            if (visited.includes(coords)) { //previously visit panel
                ix = visited.indexOf(coords);
            } else { // new panel
                points.push(new Point(robotx, roboty));
                visited.push(coords);
                ix = visited.length - 1;
            }
            let todo = comp.compute([points[ix].Color]);
            points[ix].Color = (todo[0]);
            if (todo[1] == 0) { //left
                if (dir == 'u') { dir = 'l'; } else if (dir == 'l') { dir = 'd'; } else if (dir == 'd') { dir = 'r'; } else { dir = 'u'; }
            } else { //right
                if (dir == 'u') { dir = 'r'; } else if (dir == 'r') { dir = 'd'; } else if (dir == 'd') { dir = 'l'; } else { dir = 'u'; }
            }
            switch (dir) {
                case 'u': roboty++; break;
                case 'l': robotx--; break;
                case 'd': roboty--; break;
                case 'r': robotx++; break;
            }
        }
        return visited.length;
    }

    public static part2(inputs: string[]) {
        if (inputs[0] == '') {
            return 0;
        }

        let robotx = 50;
        let roboty = 50;
        let dir = 'u';
        let points: Point[] = [];
        let visited = [];
        let ix, coords;
        let comp: IntCodeComputer = new IntCodeComputer(inputs, 2);
        let point = new Point(robotx, roboty);
        let grid: number[][] = [];
        for (let i = 0; i < 100; i++) {
            grid.push([]);
            for (let j = 0; j < grid[i].length; j++) {
                grid[i][j] = 0;
            }
        }
        grid[50][50] = 0;
        point.Color = 1;
        coords = robotx.toString() + ',' + roboty.toString();
        points.push(point);
        visited.push(coords);

        while (!comp.done) {
            coords = robotx.toString() + ',' + roboty.toString();
            if (visited.includes(coords)) {
                ix = visited.indexOf(coords);
            } else {
                points.push(new Point(robotx, roboty));
                visited.push(coords);
                ix = visited.length - 1;
            }
            let todo = comp.compute([points[ix].Color]);
            points[ix].Color = (todo[0]);
            grid[points[ix].X][points[ix].Y] = points[ix].Color;
            if (todo[1] == 0) { //left
                if (dir == 'u') { dir = 'l'; } else if (dir == 'l') { dir = 'd'; } else if (dir == 'd') { dir = 'r'; } else { dir = 'u'; }
            } else { //right
                if (dir == 'u') { dir = 'r'; } else if (dir == 'r') { dir = 'd'; } else if (dir == 'd') { dir = 'l'; } else { dir = 'u'; }
            }
            switch (dir) {
                case 'u': roboty++; break;
                case 'l': robotx--; break;
                case 'd': roboty--; break;
                case 'r': robotx++; break;
            }
        }
        let s = '\n';
        for (let j = 50; j >= 45; j--) {
            for (let i = 50; i < 90; i++) {
                if (grid[i][j] == 1) {
                    s += '*';
                } else {
                    s += ' ';
                }
            }
            s += '\n';
        }
        return s;
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
        let p = this.stack;
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

class Point {
    public X: number;
    public Y: number;
    public Color: number = 0;

    public constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
    }
}

