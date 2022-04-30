/**
 * wraper of encoded object
 * gives easier interaction with it
 */
export default class ButchObj
{
    public data: {[key: string]: any};
    public codes: {[key: string]: string};
    public extention: {[key: string]: any} = {};

    constructor(obj: {[key: string]: any}, codes: {[key: string]: string}) {
        this.codes = codes;
        this.data = obj;
    }

    /**
    * recursive ButchObj finder 
    */
    static goToNode(obj: {[key: string]: any}, path: number[],
       codes: {[key: string]: string}) : {[key: string]: any} | undefined   
    {
        let node = obj;
        for (let i = 0; i < path.length; ++i) {
           if (!node[codes.content]) return undefined;
           node = node[codes.content][path[i]];
        }
        return node
    }

    get(key: string): string | any {
        return this.data[this.codes[key]];
    }

    content(): {[key: string]: any}[] {
        return this.data[this.codes.content];
    }

    set(key: string, value: string | {[key: string]: any}[]) {
        this.data[this.codes[key]] = value;
    }

    goTo(...indexes: number[]): ButchObj {
        const obj = ButchObj.goToNode(this.data, indexes, this.codes)
        if (!obj) {
            throw Error("Invalid path to find block")
        }
        this.goTo(1, 2, 3, 4, 5)
        return new ButchObj(obj, this.codes);
    }
}