import { AssertionError } from "assert";
import { lookup } from "dns";
import { DiffieHellman } from "crypto";

export class Main {
    public static start(input: string) {
        let answer1 = this.part1(input.split('\n'));
        let answer2 = this.part2(input.split('\n'));
        return [answer1, answer2];
    }

    public static part1(inputs: string[]) {
        let asteroidMap = inputs.map(input => input.split(''));
        let asteroids: Point[] = [];
        for (let i = 0; i < asteroidMap.length; i++) {
            const element = asteroidMap[i];
            for (let j = 0; j < element.length; j++) {
                const element1 = element[j];
                if (element1 == '#') {
                    asteroids.push(new Point(i, j));
                }
            }
        }
        for (let i = 0; i < asteroids.length; i++) {
            const element = asteroids[i];
            for (let j = 0; j < asteroids.length; j++) {
                const element1 = asteroids[j];
                if (i == j) {
                    continue;
                }
                let xDiff = element1.X - element.X;
                let yDiff = element1.Y - element.Y;
                let xFactor = 0;
                let yFactor = 0;
                if (xDiff == 0) {
                    yFactor = yDiff / Math.abs(yDiff);
                    xFactor = 0;
                } else
                    if (yDiff == 0) {
                        yFactor = 0;
                        xFactor = xDiff / Math.abs(xDiff);
                    }
                    else if (xDiff > yDiff) {
                        let divisor = ggt(Math.abs(xDiff), Math.abs(yDiff));
                        xFactor = xDiff / divisor;
                        yFactor = yDiff / divisor;
                    } else if (yDiff > xDiff) {
                        let divisor = ggt(Math.abs(xDiff), Math.abs(yDiff));
                        yFactor = yDiff / divisor;
                        xFactor = xDiff / divisor;
                    } else {
                        xFactor = xDiff / Math.abs(xDiff);
                        yFactor = yDiff / Math.abs(yDiff);
                    }
                let intersection = false;
                let tempPoint = new Point(element.X, element.Y);
                while (!intersection && (tempPoint.X !== element1.X || tempPoint.Y !== element1.Y)) {
                    tempPoint.X += xFactor;
                    tempPoint.Y += yFactor;
                    asteroids.find(v => {
                        if (v == element1 || v == element) {
                            return false;
                        } else if (v.X == tempPoint.X && v.Y == tempPoint.Y) {
                            return true;
                        } else {
                            return false;
                        }
                    }) !== undefined ? intersection = true : intersection = false;
                }
                if (!intersection) {
                    element.Intersections++;
                }
            }
        }
        let max = 0;
        for (let index = 0; index < asteroids.length; index++) {
            const element = asteroids[index];
            if (element.Intersections > max) {
                max = element.Intersections;
            }
        }
        return max;
    }


    public static part2(inputs: string[]) {
        let asteroidMap = inputs.map(input => input.split(''));
        let asteroids: Point[] = [];
        for (let i = 0; i < asteroidMap.length; i++) {
            const element = asteroidMap[i];
            for (let j = 0; j < element.length; j++) {
                const element1 = element[j];
                if (element1 == '#') {
                    asteroids.push(new Point(i, j));
                }
            }
        }
        for (let i = 0; i < asteroids.length; i++) {
            const element = asteroids[i];
            for (let j = 0; j < asteroids.length; j++) {
                const element1 = asteroids[j];
                if (i == j) {
                    continue;
                }
                let xDiff = element1.X - element.X;
                let yDiff = element1.Y - element.Y;
                let xFactor = 0;
                let yFactor = 0;
                if (xDiff == 0) {
                    yFactor = yDiff / Math.abs(yDiff);
                    xFactor = 0;
                } else
                    if (yDiff == 0) {
                        yFactor = 0;
                        xFactor = xDiff / Math.abs(xDiff);
                    }
                    else if (xDiff > yDiff) {
                        let divisor = ggt(Math.abs(xDiff), Math.abs(yDiff));
                        xFactor = xDiff / divisor;
                        yFactor = yDiff / divisor;
                    } else if (yDiff > xDiff) {
                        let divisor = ggt(Math.abs(xDiff), Math.abs(yDiff));
                        yFactor = yDiff / divisor;
                        xFactor = xDiff / divisor;
                    } else {
                        xFactor = xDiff / Math.abs(xDiff);
                        yFactor = yDiff / Math.abs(yDiff);
                    }
                let intersection = false;
                let tempPoint = new Point(element.X, element.Y);
                while (!intersection && (tempPoint.X !== element1.X || tempPoint.Y !== element1.Y)) {
                    tempPoint.X += xFactor;
                    tempPoint.Y += yFactor;
                    asteroids.find(v => {
                        if (v == element1 || v == element) {
                            return false;
                        } else if (v.X == tempPoint.X && v.Y == tempPoint.Y) {
                            return true;
                        } else {
                            return false;
                        }
                    }) !== undefined ? intersection = true : intersection = false;
                }
                if (!intersection) {
                    element.Intersections++;
                }
            }
        }
        let maxElement = asteroids[0];
        for (let index = 1; index < asteroids.length; index++) {
            const element = asteroids[index];
            if (element.Intersections > maxElement.Intersections) {
                maxElement = element;
            }
        }
        asteroids = asteroids.filter(a => a !== maxElement);
        asteroids.forEach(a => {
            a.Direction = (Math.atan2(a.X - maxElement.X, a.Y - maxElement.Y) * 180 / Math.PI) + 90;
            if (a.Direction < 0) {
                a.Direction = 360 + a.Direction;
            }
        });
        asteroids.sort((a, b) =>
            a.Direction == b.Direction ?
                Math.abs(maxElement.X - b.X * maxElement.Y - b.Y) - Math.abs(maxElement.X - a.X * maxElement.Y - a.Y) :
                a.Direction - b.Direction);
        let count = 0;
        let lastAttack = -1;
        let lastElem;
        let i = 0
        while (asteroids.length > 0&&count<200) {
            if (lastAttack != asteroids[i].Direction) {
                lastAttack = asteroids[i].Direction;
                count++;
                lastElem=asteroids.splice(i, 1)[0];
            } else {
                i++;
                if (i == asteroids.length) {
                    i = 0;
                }
            }
        }
        return lastElem.Y*100+lastElem.X;
    }
}

function ggt(a, b) {
    var r;
    do {
        r = a % b;
        a = b;
        b = r;
    }
    while (r > 0);
    return a;
}

class Point {
    public X: number;
    public Y: number;
    public Intersections: number = 0;
    public Direction: number = 0;

    public constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
    }
}