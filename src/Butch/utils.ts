import rnfs from "react-native-fs";

const variableCheck = /^[a-zA-Z_]\w*/;
const defaultCodesPath = rnfs.DocumentDirectoryPath + "/bch/codes.json";

function indexCodeNames(codeNames: string[]) {
    let obj: {[key: string]: string} = {}
    codeNames.forEach((name, index) => {
        obj[name] = index.toString(16);
    });
    return obj;
}

export function createBchFolder() {
    return rnfs.exists(rnfs.DocumentDirectoryPath + "/bch")
        .then(res => {
            if (!res) rnfs.mkdir(rnfs.DocumentDirectoryPath + "/bch");
        })
}

export function verifyVariableName(name: string) {
    return variableCheck.exec(name) !== null;
}

export const readButchCodesSet = (path: string) =>
    rnfs.readFile(path).then(data => data.split(/\s*\n+\s*/));

export const readButchCodesSetAssets = () =>
    rnfs.readFileAssets("bch/codes.set.txt").then(data => data.split(/\s*\n+\s*/));

export function createButchCodesFile(codesSet: string[], outPath: string = "") {
    return createBchFolder()
        .then(() => rnfs.writeFile(outPath || defaultCodesPath, JSON.stringify(indexCodeNames(codesSet))));
}
    
export function readButchCodes(path: string = "") { 
    return createBchFolder()
        .then(() => rnfs.readFile(path || defaultCodesPath).then(data => JSON.parse(data)));
}

export const readButchCodesAssets = () => 
    rnfs.readFileAssets("bch/codes.json").then(data => JSON.parse(data))      
