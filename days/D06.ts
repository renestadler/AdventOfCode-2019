export class Main {
    public static start(input: string) {
        let answer1 = this.part1(input.split('\r\n'));
        let answer2 = this.part2(input.split('\r\n'));
        return [answer1, answer2];
    }

    public static part1(inputs: string[]) {
        let input = inputs.map(s => s.split(")"));
        let orbits: Map<string, Orbit>=new Map();
        for (let index = 0; index < input.length; index++) {
            const element = input[index];
            if (orbits.has(element[1])) {
                if (orbits.has(element[0])) {
                    orbits.get(element[1]).orbited.push(orbits.get(element[0]));
                } else {
                    let orbit = new Orbit();
                    orbit.value = element[0];
                    orbits.set(element[0],orbit);
                    orbits.get(element[1]).orbited.push(orbit);

                }
            } else {
                if (orbits.has(element[0])) {
                    let orbit=new Orbit();
                    orbit.value=element[1];
                    orbit.orbited.push(orbits.get(element[0]));
                    orbits.set(element[1],orbit);
                } else {
                    let orbit=new Orbit();
                    orbit.value=element[1];
                    let orbit2 = new Orbit();
                    orbit2.value = element[0];
                    orbit.orbited.push(orbit2);
                    orbits.set(element[1],orbit);
                    orbits.set(element[0],orbit2);

                }

            }

        }
        let totalOrbits=0;
        orbits.forEach((key)=>{
            totalOrbits+=key.getTotalOrbits()-1;
        });
        return totalOrbits;
    }

    public static part2(inputs: string[]) {
        let input = inputs.map(s => s.split(")"));
        let orbits: Map<string, Orbit>=new Map();
        for (let index = 0; index < input.length; index++) {
            const element = input[index];
            if (orbits.has(element[1])) {
                if (orbits.has(element[0])) {
                    orbits.get(element[0]).gotOrbited.push(orbits.get(element[1]));
                    orbits.get(element[1]).orbited.push(orbits.get(element[0]));
                } else {
                    let orbit = new Orbit();
                    orbit.value = element[0];
                    orbit.gotOrbited.push(orbits.get(element[1]));
                    orbits.set(element[0],orbit);
                    orbits.get(element[1]).orbited.push(orbit);

                }
            } else {
                if (orbits.has(element[0])) {
                    let orbit=new Orbit();
                    orbit.value=element[1];
                    orbit.orbited.push(orbits.get(element[0]));
                    orbits.get(element[0]).gotOrbited.push(orbit);
                    orbits.set(element[1],orbit);
                } else {
                    let orbit=new Orbit();
                    orbit.value=element[1];
                    let orbit2 = new Orbit();
                    orbit2.value = element[0];
                    orbit.orbited.push(orbit2);
                    orbit2.gotOrbited.push(orbit);
                    orbits.set(element[1],orbit);
                    orbits.set(element[0],orbit2);
                }

            }
        }
        let you=orbits.get("YOU").getAllOrbits();
        let san=orbits.get("SAN").getAllOrbits();
        let count=-1;
        for (let i = 0; i < you.length; i++) {
            const element = you[i];
            count++;
            if(san.findIndex(a=>a===element)!=-1){
                let el=san.findIndex(a=>a===element);
                count+=el;
                break;
            }
        }
        return count-2;
    }
}

class Orbit {
    public value: string;
    public orbited: Orbit[] = [];
    public gotOrbited: Orbit[] = [];

    public getTotalOrbits(){
        let count=1;
        this.orbited.forEach(element => {
            count+=element.getTotalOrbits();
        });
        return count;
    }
    public getAllOrbits(){
        let orbits:string[]=[];
        orbits.push(this.value);
        this.orbited.forEach(element => {
            let newOrbits=element.getAllOrbits();
            newOrbits.forEach(element1=>orbits.push(element1));
        });
        return orbits;
    }
}