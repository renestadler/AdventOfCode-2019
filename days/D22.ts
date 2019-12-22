import bigInteger from "big-integer";

export class Main {
    public static start(input: string) {
        let answer1 = this.part1(input.split('\r\n'));
        let answer2 = this.part2(input.split('\r\n'));
        return [answer1, answer2];
    }

    public static part1(inputs: string[]) {
        let numCards = 0;
        if (inputs.length == 10) {
            numCards = 10;
        } else {
            numCards = 10007;
        }
        let deck = [];
        for (let i = 0; i < numCards; i++) {
            deck.push(i);
        }
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].startsWith("cut")) {
                let cutNum = parseInt(inputs[i].split(" ")[1]);
                if (cutNum > 0) {
                    let temp = deck.splice(0, cutNum);
                    for (let j = 0; j < temp.length; j++) {
                        deck.push(temp[j]);
                    }
                } else {
                    let temp = deck.splice(deck.length + cutNum, Math.abs(cutNum));
                    for (let j = temp.length - 1; j >= 0; j--) {
                        deck.unshift(temp[j]);
                    }
                }
            } else if (inputs[i].startsWith("deal with increment")) {
                let newDeck = [];
                for (let j = 0; j < numCards; j++) {
                    newDeck.push(j);
                }
                let curPosition = 0;
                let movement = parseInt(inputs[i].split(" ")[3]);
                while (deck.length > 0) {
                    newDeck[curPosition] = deck.shift();
                    curPosition += movement;
                    if (curPosition >= newDeck.length) {
                        curPosition -= newDeck.length;
                    }
                }
                deck = newDeck;
            } else {
                deck = deck.reverse();
            }
        }
        if (numCards > 100) {
            return deck.findIndex(d => d == 2019);
        } else {
            return deck.findIndex(d => d == 9);
        }
    }

    public static part2(inputs: string[]) {
        if (inputs.length == 10) {
            return 0;
        }
        let numCards = 119315717514047;
        let numIters = 101741582076661;
        let cards = [1, 0];

        const mod = (m: number, n: number) => ((m % n) + n) % n;
        const rev = ((cards: number[]) =>
            [mod((-cards[0]), numCards), mod((-cards[1] - 1), numCards)]);
        const cut = ((cards: number[], n: number) =>
            [cards[0], mod((cards[1] - n), numCards)]);
        const deal = ((cards: number[], n: number) =>
            [mod((cards[0] * n), numCards), mod((cards[1] * n), numCards)]);
        for (let i = 0; i < inputs.length; i++) {
            const element = inputs[i];
            if (inputs[i].startsWith("cut")) {
                let cutNum = parseInt(inputs[i].split(" ")[1]);
                cards = cut(cards, cutNum);
            } else if (inputs[i].startsWith("deal with increment")) {
                let movement = parseInt(inputs[i].split(" ")[3]);
                cards = deal(cards, movement);
            } else {
                cards = rev(cards);
            }
        }
        let a = bigInteger(cards[0])
        let b = bigInteger(cards[1]);
        let an = a.modPow(numIters, numCards);
        let A = an;
        let B = b.multiply(an.minus(1)).multiply(a.minus(1).modInv(numCards));
        return bigInteger(2020).minus(B).multiply(A.modInv(numCards)).mod(numCards).add(numCards).mod(numCards)
    }
}