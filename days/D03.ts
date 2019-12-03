export class Main {
    public static start(input: string) {
        let answer1 = this.part1(input.split('\r\n'));
        let answer2 = this.part2(input.split('\r\n'));
        return [answer1, answer2];
    }

    public static part1(inputs: string[]) {
        let input1=inputs[0].split(",");
        let input2=inputs[1].split(",");

        let points1=[];

        let x1=0;
        let y1=0;
        input1.map(a=>{
            for (let i = 0; i < parseInt(a.substring(1)); i++) {
                switch(a.charAt(0)){
                    case "R": x1++;break;
                    case "L": x1--;break;
                    case "U": y1--;break;
                    case "D": y1++;break;
                }
                points1.push({x:x1,y:y1});
            }
        })

        let points2=[];
        let x2=0;
        let y2=0;
        input2.map(a=>{
            for (let i = 0; i < parseInt(a.substring(1)); i++) {
                switch(a.charAt(0)){
                    case "R": x2++;break;
                    case "L": x2--;break;
                    case "U": y2--;break;
                    case "D": y2++;break;
                }
                points2.push({x:x2,y:y2});
            }
        })

        let intersections=[];
        points1.forEach(a=>{
            if(points2.find(e=>(e.x==a.x&&e.y==a.y))){
                intersections.push(a);
            }
        })

        let smallest=100000;
        for (let index = 0; index < intersections.length; index++) {
            const element = intersections[index];
            if(Math.abs(element.x)+Math.abs(element.y)<smallest){
                smallest=Math.abs(element.x)+Math.abs(element.y);
            }
        }
        return smallest;
    }

    public static part2(inputs: string[]) {
        let input1=inputs[0].split(",");
        let input2=inputs[1].split(",");

        let points1=[];

        let x1=0;
        let y1=0;
        input1.map(a=>{
            for (let i = 0; i < parseInt(a.substring(1)); i++) {
                switch(a.charAt(0)){
                    case "R": x1++;break;
                    case "L": x1--;break;
                    case "U": y1--;break;
                    case "D": y1++;break;
                }
                points1.push({x:x1,y:y1});
            }
        })

        let points2=[];
        let x2=0;
        let y2=0;
        input2.map(a=>{
            for (let i = 0; i < parseInt(a.substring(1)); i++) {
                switch(a.charAt(0)){
                    case "R": x2++;break;
                    case "L": x2--;break;
                    case "U": y2--;break;
                    case "D": y2++;break;
                }
                points2.push({x:x2,y:y2});
            }
        })
        let intersections=[];
        for (let index = 0; index < points1.length; index++) {
            const element = points1[index];
            for (let index1 = 0; index1 < points2.length; index1++) {
                const element1 = points2[index1];
                if(element.x==element1.x&&element.y==element1.y){
                    intersections.push(index1+index+2);
                }
            }
        }
        let smallest=100000;
        for (let index = 0; index < intersections.length; index++) {
            const element = intersections[index];
            if(element<smallest){
                smallest=element;
            }
        }
        return smallest;
    }
}