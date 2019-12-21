export class Main {
    public static start(input: string) {
        let answer1 = this.part1(input);
        let answer2 = this.part2(input);
        return [answer1, answer2];
    }

    public static part1(inputs: string) {
        return collectKeys(inputs);
    }

    public static part2(inputs) {
        return collectKeys(updateInput(inputs));
    }
}

type KeyVault = string[][];
type Link = ReachablePosition | UnreachablePosition;

class ReachablePosition {
    constructor(readonly distance: number, readonly doors: string[]) { }
    public allClear(doorsOpen: string[]): boolean {
        return this.doors.every(d => doorsOpen.includes(d));
    }
}

class UnreachablePosition {
    constructor(readonly distance = Number.MAX_SAFE_INTEGER) { }
    public allClear(_: string[]): boolean {
        return false;
    }
}


interface Dictionary<T> {
    [key: string]: T;
}

interface Key {
    loc: number[];
    links: Dictionary<Link>;
}

type Keys = Dictionary<Key>;

type Queue = [number, number, number, string[]];

const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
const buildKey = (l: number[]): Key => ({ loc: l, links: {} });
const isKey = (c: string) => 'a' <= c && c <= 'z';
const isDoor = (c: string) => 'A' <= c && c <= 'Z';
const parseLine = (
    [v, keys, entrances]: [KeyVault, Keys, string[]],
    l: string,
    y: number
) => {
    const contents = l.split('');
    contents.forEach((c, x) => {
        if (isKey(c)) {
            keys[c] = buildKey([x, y]);
        } else if (c === '@') {
            const entrance = entrances.length.toString();
            keys[entrance] = buildKey([x, y]);
            entrances.push(entrance);
        }
    });
    v.push(contents);
    return [v, keys, entrances] as [KeyVault, Keys, string[]];
};
const parse = (ip: string) => ip.split('\r\n').reduce(parseLine, [[], {}, []] as [KeyVault, Keys, string[]]);
const getNext = ([x, y]: number[]) => dirs.map(([xi, yi]) => [x + xi, y + yi]);
const notWall = (v: KeyVault, [x, y]: number[]) => 0 <= y && y < v.length && v[y][x] !== '#' && v[y][x] !== undefined;
const km = ([x, y]: number[]) => `K${x}_${y}`;
const getLink = (v: KeyVault, [fx, fy]: number[], [tx, ty]: number[]): Link => {
    const queue = [[fx, fy, 0, []]] as Queue[];
    const visited = new Set<string>();
    while (queue.length > 0) {
        const [x, y, d, doors] = queue.shift() as Queue;
        visited.add(km([x, y]));
        const locs = getNext([x, y]).filter(
            l => !visited.has(km(l)) && notWall(v, l)
        );
        for (const [nx, ny] of locs) {
            if (nx === tx && ny === ty) {
                return new ReachablePosition(d + 1, doors);
            }
            const c = v[ny][nx];
            let nDoors = doors;
            if (isDoor(c)) {
                nDoors = [...doors, c.toLowerCase()];
            }
            queue.push([nx, ny, d + 1, nDoors]);
        }
    }
    return new UnreachablePosition();
};
const findShortestPath = (
    places: string[],
    keys: Keys,
    visited: string[],
    positions: string[], // Current positions for each robots
    distance: number,
    memo: Dictionary<number>
): number => {
    if (places.length === visited.length) {
        return distance;
    }
    const remaining = places.filter(k => !visited.includes(k));
    const mk = positions.join() + ':' + remaining.join();
    if (memo[mk] !== undefined) {
        return memo[mk] + distance;
    }
    let min = Number.MAX_SAFE_INTEGER;
    for (let pi = 0; pi < positions.length; pi++) {
        const current = positions[pi];
        const links = keys[current].links;
        for (const nk of remaining.filter(r => links[r].allClear(visited))) {
            const nPositions = [...positions];
            nPositions[pi] = nk;
            // prettier-ignore
            min = Math.min(
                min,
                findShortestPath(places, keys, [...visited, nk], nPositions, distance + links[nk].distance, memo)
            );
        }
    }
    memo[mk] = min - distance;
    return min;
};
const collectKeys = (ip: string) => {
    const [v, keys, entrances] = parse(ip);
    const places = Object.keys(keys).sort();
    for (let i = 0; i < places.length; i++) {
        const a = keys[places[i]];
        const aName = places[i];
        for (let j = i + 1; j < places.length; j++) {
            const b = keys[places[j]];
            const bName = places[j];
            const link = getLink(v, a.loc, b.loc);
            a.links[bName] = link;
            b.links[aName] = link;
        }
    }
    const positions = [...entrances];
    return findShortestPath(places, keys, entrances, positions, 0, {});
};
const updateInput = (ip: string) => {
    const grid = ip.split('\r\n').map(l => l.split(''));
    const [ex, ey] = [(grid[0].length + 1) / 2 - 1, (grid.length + 1) / 2 - 1];
    grid[ey - 1][ex - 1] = '@';
    grid[ey - 1][ex + 0] = '#';
    grid[ey - 1][ex + 1] = '@';
    grid[ey + 0][ex - 1] = '#';
    grid[ey + 0][ex + 0] = '#';
    grid[ey + 0][ex + 1] = '#';
    grid[ey + 1][ex - 1] = '@';
    grid[ey + 1][ex + 0] = '#';
    grid[ey + 1][ex + 1] = '@';
    return grid.map(l => l.join('')).join('\r\n');
};