// import { FuncBlock, Environment, Block } from "./base.js"
import { _dereferenceBlock } from "./blocks.js"
import * as Butch from "./Butch.js"
import * as fs from "fs"
import { createButchCodesFile, readButchCodesFile } from "./utils.js"
import ButchObj from "./ButchObj.js"

createButchCodesFile("../.bch/ButchCodesSet.txt", "../.bch/");

const codes = readButchCodesFile("../.bch/ButchCodes.json")
const builder = new Butch.ButchBuilder(codes);

function test() {
    const file = fs.readFileSync("../.bch/testProgram.bch");
    const bobj = new ButchObj(JSON.parse(file.toString()), codes);
    
    const program = builder.build(bobj);
    program.execute();
}

builder.encodeNamedProgram("../.bch/testProgram.json", () => {
    console.log("encoded");
    test();
});
