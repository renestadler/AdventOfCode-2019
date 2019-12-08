
export class Main {
    public static start(input: string) {
        let answer1 = this.part1(input.split(''));
        let answer2 = this.part2(input.split(''));
        return [answer1, answer2];
    }

    public static part1(inputs: string[]) {
        let ar = inputs.map(v => parseInt(v));
        let width = 0;
        let height;
        if (inputs.length < 50) {
            width = 3;
            height = 2;
        } else {
            width = 25;
            height = 6;
        }
        let minNum0 = 1000;
        let sum = 0;
        let num0 = 0;
        let num1 = 0;
        let num2 = 0;
        for (let i = 0; i < ar.length; i++) {
            if (ar[i] == 0) {
                num0++;
            } if (ar[i] == 1) {
                num1++;
            } if (ar[i] == 2) {
                num2++;
            }
            if (i % (width * height) == 0) {
                if (i != 0) {
                    if (num0 < minNum0) {
                        minNum0 = num0;
                        sum = num1 * num2;
                    }
                }
                num0 = 0;
                num1 = 0;
                num2 = 0;
            }
        }
        if (num0 < minNum0) {
            minNum0 = num0;
            sum = num1 * num2;
        }
        return sum;
    }

    public static part2(inputs: string[]) {
        let ar = inputs.map(v => parseInt(v));
        let width = 0;
        let height;
        if (inputs.length < 50) {
            width = 2;
            height = 2;
        } else {
            width = 25;
            height = 6;
        }
        let layer=[];
        for (let i = 0; i < width*height; i++) {
            layer.push(2);
            
        }
        for (let i = 0; i < ar.length; i++) {
            if(layer[i % (width * height)]==2){
                layer[i % (width * height)]=ar[i];
            }
        }
        let output="";
        for (let i = 0; i < layer.length; i++) {
            let element = layer[i];
            if(element==0){
                element=" ";
            }
            if(i%width==0){
                output+="\n"+element;    
            }else{
                output+=element;
            }
        }
        return output;
    }
}