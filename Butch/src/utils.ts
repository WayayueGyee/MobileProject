import _path from "path";
import fs from "fs";

const variableCheck = /^[a-zA-Z_]\w*/;

export function verifyVariableName(name: string) {
    return variableCheck.exec(name) !== null;
}

export function indexCodeNames(codeNames: string[]) {
    let obj: {[key: string]: string} = {}
    codeNames.forEach((name, index) => {
        obj[name] = index.toString(16);
    });
    return obj;
}

export function createButchCodesFile(pathToCodesSet: string, outPath: string) {
    const data = fs.readFileSync(pathToCodesSet).toString();
    let codeNames = data.split(/\s*\n+\s*/);
    let indexed = indexCodeNames(codeNames);
    
    fs.writeFileSync(_path.join(outPath, "ButchCodes.json"), JSON.stringify(indexed));
}

export const readButchCodesFile = (pathToButchCodes: string): {[key: string]: string} => 
    JSON.parse(fs.readFileSync(pathToButchCodes).toString());