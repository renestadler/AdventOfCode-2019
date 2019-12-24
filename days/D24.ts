export class Main {
    public static start(input: string) {
        let answer1 = this.part1(input.split('\r\n'));
        let answer2 = this.part2(input.split('\r\n'));
        return [answer1, answer2];
    }

    public static part1(inputs: string[]) {
        let input: string[][] = [];
        for (let i = 0; i < inputs.length; i++) {
            input[i] = inputs[i].split("");
        }
        let match = false;
        let prevFields: string[] = [];
        prevFields.push(input.map(c => c.join("")).join("\n"));
        while (!match) {
            let newField: string[][] = [];
            for (let i = 0; i < input.length; i++) {
                newField[i] = [];
                for (let j = 0; j < input[i].length; j++) {
                    let numBugs = 0;
                    if (i > 0) {
                        numBugs += input[i - 1][j] == '#' ? 1 : 0;
                    }
                    if (i < input.length - 1) {
                        numBugs += input[i + 1][j] == '#' ? 1 : 0;
                    }
                    if (j > 0) {
                        numBugs += input[i][j - 1] == '#' ? 1 : 0;
                    }
                    if (j < input.length - 1) {
                        numBugs += input[i][j + 1] == '#' ? 1 : 0;
                    }
                    if (input[i][j] == '#' && numBugs != 1) {
                        newField[i][j] = '.';
                    }
                    if (input[i][j] == '#' && numBugs == 1) {
                        newField[i][j] = '#';
                    }
                    if (input[i][j] == '.' && (numBugs == 1 || numBugs == 2)) {
                        newField[i][j] = '#';
                    }
                    if (input[i][j] == '.' && numBugs != 1 && numBugs != 2) {
                        newField[i][j] = '.';
                    }
                }
            }
            let fieldString = newField.map(c => c.join("")).join("\n");
            if (prevFields.findIndex(p => p == fieldString) != -1) {
                let count = 0;
                let curMass = 1;
                newField.map(c => c.join("")).join("").split("").forEach((v) => {
                    if (v == '#') {
                        count += curMass;
                    }
                    curMass *= 2;
                });
                return count;
            } else {
                prevFields.push(fieldString);
                input = newField;
            }
        }
    }

    public static part2(inputs: string[]) {
        const isDeeperLevel = {
            left: (x, y) => x === 3 && y === 2,
            right: (x, y) => x === 1 && y === 2,
            top: (x, y) => y === 3 && x === 2,
            down: (x, y) => y === 1 && x === 2
        };
        const isUpperLevel = {
            left: (x, y) => x === 0,
            right: (x, y) => x === 4,
            top: (x, y) => y === 0,
            down: (x, y) => y === 4,
        };
        const inc = {
            left: [0, -1],
            right: [0, 1],
            top: [-1, 0],
            down: [1, 0],
        };
        const getSide = (side, layer, layers, key, x, y) => {
            const deeper = isDeeperLevel[side](x, y);
            const upper = isUpperLevel[side](x, y);

            if (deeper) {
                const l = layers[Number(key) + 1];
                if (l === undefined) {
                    return 0;
                }

                return {
                    left: [l[0][4], l[1][4], l[2][4], l[3][4], l[4][4]],
                    right: [l[0][0], l[1][0], l[2][0], l[3][0], l[4][0]],
                    top: [l[4][0], l[4][1], l[4][2], l[4][3], l[4][4]],
                    down: [l[0][0], l[0][1], l[0][2], l[0][3], l[0][4]]
                }[side].filter((x) => x === "#").length;
            }

            if (upper) {
                const l = layers[Number(key) - 1];

                if (l === undefined) {
                    return 0;
                }

                return {
                    left: l[2][1],
                    right: l[2][3],
                    top: l[1][2],
                    down: l[3][2]
                }[side] === "#" ? 1 : 0;
            }

            const [incY, incX] = inc[side];

            return layer[y + incY][x + incX] === "#" ? 1 : 0;
        }

        let input: string[][] = [];
        for (let i = 0; i < inputs.length; i++) {
            input[i] = inputs[i].split("");
        }
        input[2][2] = "?";
        let layers = { 0: input };
        let minute = 0;
        let prevFields: string[] = [];
        while (minute < 200) {
            layers[minute + 1] = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => "."));
            layers[-(minute + 1)] = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => "."));
            const temp = JSON.parse(JSON.stringify(layers));
            for (const key in layers) {
                const layer = layers[key]
                const tempLayer = Array.from({ length: 5 }, () =>
                    Array.from({ length: 5 }, () => "."),
                )
                for (let y = 0; y < layer.length; y++) {
                    for (let x = 0; x < layer.length; x++) {
                        if (x === 2 && y === 2) {
                            continue;
                        }
                        const neighbors =
                            getSide("left", layer, layers, key, x, y) +
                            getSide("right", layer, layers, key, x, y) +
                            getSide("top", layer, layers, key, x, y) +
                            getSide("down", layer, layers, key, x, y);

                        tempLayer[y][x] = (layer[y][x] === "#" && neighbors === 1) ||
                            (layer[y][x] === "." && (neighbors === 1 || neighbors === 2)) ? "#" : ".";
                    }
                }
                temp[key] = tempLayer;
            }
            layers = temp;
            minute++;
        }
        return Object.values(layers).map(l => l.map(l1 => l1.join("")).join("")).join("").split("#").length - 1;
    }
}