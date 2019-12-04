export class Main {
    public static start(input: string) {
        let answer1 = this.part1(input.split('-'));
        let answer2 = this.part2(input.split('-'));
        return [answer1, answer2];
    }

    public static part1(inputs: string[]) {
        let a = parseInt(inputs[0]);
        let b = parseInt(inputs[1]);
        let passwordNum = 0;
        for (let i = a; i <= b; i++) {
            let password = i.toString();

            let doubleFound = false;
            let invalid = false;
            for (let j = 1; j < password.length; j++) {
                if (password[j] === password[j - 1]) {
                    doubleFound = true;
                }

                if (parseInt(password[j]) < parseInt(password[j - 1])) {
                    invalid = true;
                }
            }
            if (doubleFound && !invalid) {
                passwordNum++;
            }
        }
        return passwordNum;
    }

    public static part2(inputs: string[]) {
        let a = parseInt(inputs[0]);
        let b = parseInt(inputs[1]);
        let passwordNum = 0;
        for (let i = a; i <= b; i++) {
            let password = i.toString();
            let doubleOnlyFound = false;
            let invalid = false;
            for (let j = 1; j < password.length; j++) {
                if (password[j] === password[j - 1]) {
                    if (password[j + 1] !== password[j]) {
                        if (password[j - 2] !== password[j]) {
                            doubleOnlyFound = true;
                        }
                    }
                }
                if (parseInt(password[j]) < parseInt(password[j - 1])) {
                    invalid = true;
                }
            }
            if (doubleOnlyFound && !invalid) {
                passwordNum++;
            }
        }
        return passwordNum;
    }
}