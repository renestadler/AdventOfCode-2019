export class Main {
    public static start(input: string) {
        let answer1 = this.part1(input.split('\r\n'));
        let answer2 = this.part2(input.split('\r\n'));
        return [answer1, answer2];
    }

    public static part1(inputs: string[]) {
        /*
        //Version 1
        let count = 0;
        for (let index = 0; index < inputs.length; index++) {
            count+= Math.floor(parseInt(inputs[index]) / 3) - 2;
        }
        */
        //Version 2
        return inputs.map((f) =>
            Math.floor(parseInt(f) / 3 - 2))
            .reduce((a, b) => a + b);
    }

    public static part2(inputs: string[]) {
        /*
        //Version 1
        let count = 0;
        for (let index = 0; index < inputs.length; index++) {
            let mass = Math.floor(parseInt(inputs[index]) / 3) - 2;
            if (isNaN(mass)) {
                continue;
            }
            count += mass;
            while (true) {
                mass = Math.floor(mass / 3) - 2;
                if (mass <= 0) {
                    break;
                }
                count += mass;
            }
        }
        */
        //Version 2
        let getMass = f => Math.floor(f / 3 - 2);
        let getTotalMass = f => {
            const mass = getMass(f);
            return mass <= 0 ? 0 :
                mass + getTotalMass(mass);
        };
        return inputs.map(getTotalMass)
            .reduce((a, b) => a + b);
    }
}