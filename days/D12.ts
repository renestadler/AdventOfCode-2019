import { monitorEventLoopDelay } from "perf_hooks";

export class Main {
    public static start(input: string) {
        let answer1 = this.part1(input.split('\r\n'));
        let answer2 = this.part2(input.split('\r\n'));
        return [answer1, answer2];
    }

    public static part1(inputs: string[]) {
        let moons = inputs.map(v => {
            let numbers = v.replace('<', '').replace('x=', '').replace('y=', '').replace('z=', '').split(", ").map(a => parseInt(a));
            return new Moon(numbers[0], numbers[1], numbers[2]);
        }
        );
        for (let i = 0; i < 1000; i++) {
            /*console.log("After " + i + " steps:");
            for (let j = 0; j < moons.length; j++) {
                const moon0 = moons[j];
                console.log(moon0.toString());
            }*/
            for (let j = 0; j < moons.length; j++) {
                const moon0 = moons[j];
                for (let k = j + 1; k < moons.length; k++) {
                    const moon1 = moons[k];
                    if (moon0.X > moon1.X) {
                        moon0.velX--;
                        moon1.velX++;
                    } else if (moon0.X < moon1.X) {
                        moon0.velX++;
                        moon1.velX--;
                    }
                    if (moon0.Y > moon1.Y) {
                        moon0.velY--;
                        moon1.velY++;
                    } else if (moon0.Y < moon1.Y) {
                        moon0.velY++;
                        moon1.velY--;
                    }
                    if (moon0.Z > moon1.Z) {
                        moon0.velZ--;
                        moon1.velZ++;
                    } else if (moon0.Z < moon1.Z) {
                        moon0.velZ++;
                        moon1.velZ--;
                    }
                }
            }
            for (let j = 0; j < moons.length; j++) {
                const element = moons[j];
                element.X += element.velX;
                element.Y += element.velY;
                element.Z += element.velZ;
            }
        }

        let totalEnergy = 0;
        for (let i = 0; i < moons.length; i++) {
            const element = moons[i];
            let pot = Math.abs(element.X) + Math.abs(element.Y) + Math.abs(element.Z);
            let kin = Math.abs(element.velX) + Math.abs(element.velY) + Math.abs(element.velZ);
            totalEnergy += pot * kin;
        }
        return totalEnergy;
    }

    public static part2(inputs: string[]) {
        let moons = inputs.map(v => {
            let numbers = v.replace('<', '').replace('x=', '').replace('y=', '').replace('z=', '').split(", ").map(a => parseInt(a));
            return new Moon(numbers[0], numbers[1], numbers[2]);
        }
        );
        let starts = inputs.map(v => {
            let numbers = v.replace('<', '').replace('x=', '').replace('y=', '').replace('z=', '').split(", ").map(a => parseInt(a));
            return new Moon(numbers[0], numbers[1], numbers[2]);
        });
        let repX = 0;
        let repY = 0;
        let repZ = 0;
        let i;
        loop:
        for (i = 0; i < 1000000; i++) {
            for (let j = 0; j < moons.length; j++) {
                const moon0 = moons[j];
                for (let k = j + 1; k < moons.length; k++) {
                    const moon1 = moons[k];
                    if (moon0.X > moon1.X) {
                        moon0.velX--;
                        moon1.velX++;
                    } else if (moon0.X < moon1.X) {
                        moon0.velX++;
                        moon1.velX--;
                    }
                    if (moon0.Y > moon1.Y) {
                        moon0.velY--;
                        moon1.velY++;
                    } else if (moon0.Y < moon1.Y) {
                        moon0.velY++;
                        moon1.velY--;
                    }
                    if (moon0.Z > moon1.Z) {
                        moon0.velZ--;
                        moon1.velZ++;
                    } else if (moon0.Z < moon1.Z) {
                        moon0.velZ++;
                        moon1.velZ--;
                    }
                }
            }
            let numX = 0;
            let numY = 0;
            let numZ = 0;
            for (let j = 0; j < moons.length; j++) {
                const element = moons[j];
                if (element.velX == 0 && element.X == starts[j].X) {
                    numX++;
                }
                if (element.velY == 0 && element.Y == starts[j].Y) {
                    numY++;
                }
                if (element.velZ == 0 && element.Z == starts[j].Z) {
                    numZ++;
                }
                element.X += element.velX;
                element.Y += element.velY;
                element.Z += element.velZ;
            }
            if (numX == moons.length) {
                repX = i + 1;
            }
            if (numY == moons.length) {
                repY = i + 1;
            }
            if (numZ == moons.length) {
                repZ = i + 1;
            }
            if (repX != 0 && repY != 0 && repZ != 0) {
                break;
            }
        }
        return (lcm(lcm(repX, repY), repZ));
    }
}

function gcd(a, b) {
    return !b ? a : gcd(b, a % b);
}

function lcm(a, b) {
    return (a * b) / gcd(a, b);
}


class Moon {
    public X;
    public Y;
    public Z;
    public velX = 0;
    public velY = 0;
    public velZ = 0;

    constructor(x, y, z) {
        this.X = x;
        this.Y = y;
        this.Z = z;
    }

    public toString(): string {
        return "pos=<x=" + this.X + ", y=" + this.Y + ", z=" + this.Z + ">, vel=<x=" + this.velX + ", y=" + this.velY + ", z=" + this.velZ + ">";

    }
}