export class Main {
    public static start(input: string) {
        let answer1 = this.part1(input.split('\r\n'));
        let answer2 = this.part2(input.split('\r\n'));
        return [answer1, answer2];
    }

    public static part1(inputs: string[]) {
        let materials: Material[] = [];
        inputs.forEach(i => {
            let input = i.split(" => ");
            let outputs = input[1].split(" ");
            let outputAmount = parseInt(outputs[0]);
            let output = outputs[1];
            let material = new Material(output, outputAmount);
            input = input[0].split(", ");
            for (let i = 0; i < input.length; i++) {
                outputs = input[i].split(" ");
                let amount = parseInt(outputs[0]);
                let name = outputs[1];
                material.addInput(name, amount);
            }
            materials.push(material);
        });
        let Overflow: Material[] = [];
        let CurrentlyNeeded: Material[] = [];
        CurrentlyNeeded.push(materials.find(m => m.Name == "FUEL"));
        let onlyOre = false;
        while (!onlyOre) {
            onlyOre = true;
            let TempNeeded = [];
            //console.log("==============");
            //console.log(CurrentlyNeeded);
            //console.log("==============");
            loop:
            CurrentlyNeeded.forEach(c => {
                for (let i = 0; i < c.InputName.length; i++) {
                    const element = c.InputName[i];
                    if (element == "ORE") {
                        TempNeeded.push(c);
                        return;
                    } else {
                        onlyOre = false;
                    }
                    let elementAmount = c.InputAmount[i] * c.Amount;
                    let available = Overflow.findIndex(o => o.Name == element);
                    if (available !== -1) {
                        let overflowed = Overflow.splice(available, 1)[0];
                        elementAmount -= overflowed.Amount;
                        if (elementAmount < 0) {
                            overflowed.Amount = Math.abs(elementAmount);
                            elementAmount = 0;
                            Overflow.push(overflowed);
                            continue;
                        }
                    }
                    let material = materials.find(m => m.Name == element);
                    let diff = (elementAmount % material.Amount);
                    if (diff != 0) {
                        Overflow.push(new Material(material.Name, material.Amount - diff));
                    }
                    if (diff != 0) {
                        diff = material.Amount - diff;
                    }
                    let getNow = (elementAmount + diff);
                    let curMaterial = new Material(material.Name, getNow / material.Amount);
                    curMaterial.InputName = material.InputName;
                    curMaterial.InputAmount = material.InputAmount;
                    TempNeeded.push(curMaterial);
                }
            });
            CurrentlyNeeded = TempNeeded;
        }
        let sum = 0
        CurrentlyNeeded.forEach(c => sum += c.InputAmount[0] * c.Amount);
        return sum;
    }

    public static part2(inputs: string[]) {
        let materials: Material[] = [];
        inputs.forEach(i => {
            let input = i.split(" => ");
            let outputs = input[1].split(" ");
            let outputAmount = parseInt(outputs[0]);
            let output = outputs[1];
            let material = new Material(output, outputAmount);
            input = input[0].split(", ");
            for (let i = 0; i < input.length; i++) {
                outputs = input[i].split(" ");
                let amount = parseInt(outputs[0]);
                let name = outputs[1];
                material.addInput(name, amount);
            }
            materials.push(material);
        });
        let increase = 100000;
        let curAmount = 1;
        while (true) {
            let Overflow: Material[] = [];
            let CurrentlyNeeded: Material[] = [];
            let startMaterial = materials.find(m => m.Name == "FUEL");
            startMaterial.Amount = curAmount;
            CurrentlyNeeded.push(startMaterial);
            let onlyOre = false;
            while (!onlyOre) {
                onlyOre = true;
                let TempNeeded = [];
                //console.log("==============");
                //console.log(CurrentlyNeeded);
                //console.log("==============");
                loop:
                CurrentlyNeeded.forEach(c => {
                    for (let i = 0; i < c.InputName.length; i++) {
                        const element = c.InputName[i];
                        if (element == "ORE") {
                            TempNeeded.push(c);
                            return;
                        } else {
                            onlyOre = false;
                        }
                        let elementAmount = c.InputAmount[i] * c.Amount;
                        let available = Overflow.findIndex(o => o.Name == element);
                        if (available !== -1) {
                            let overflowed = Overflow.splice(available, 1)[0];
                            elementAmount -= overflowed.Amount;
                            if (elementAmount < 0) {
                                overflowed.Amount = Math.abs(elementAmount);
                                elementAmount = 0;
                                Overflow.push(overflowed);
                                continue;
                            }
                        }
                        let material = materials.find(m => m.Name == element);
                        let diff = (elementAmount % material.Amount);
                        if (diff != 0) {
                            Overflow.push(new Material(material.Name, material.Amount - diff));
                        }
                        if (diff != 0) {
                            diff = material.Amount - diff;
                        }
                        let getNow = (elementAmount + diff);
                        let curMaterial = new Material(material.Name, getNow / material.Amount);
                        curMaterial.InputName = material.InputName;
                        curMaterial.InputAmount = material.InputAmount;
                        TempNeeded.push(curMaterial);
                    }
                });
                CurrentlyNeeded = TempNeeded;
            }
            let sum = 0;
            CurrentlyNeeded.forEach(c => sum += c.InputAmount[0] * c.Amount);
            if(sum<1000000000000){
                curAmount+=increase;
                continue;
            }else{
                if(increase>1){
                    curAmount-=increase;
                    increase/=10;
                    curAmount+=increase;
                }else{
                    return curAmount-1;
                }
            }
        }
    }
}

class Material {
    public Name: string;
    public Amount: number;
    public InputName: string[] = [];
    public InputAmount: number[] = [];
    constructor(name: string, amount: number) {
        this.Name = name;
        this.Amount = amount;
    }

    public addInput(name: string, amount: number) {
        this.InputAmount.push(amount);
        this.InputName.push(name);
    }
}