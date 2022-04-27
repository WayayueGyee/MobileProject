import { FuncBlock, Environment, Block } from "./base.js"
import { DeclareBlock, InvokeBlock, TextBlock, _dereferenceBlock } from "./blocks.js"
import * as Butch from "./Butch.js"
import * as fs from "fs"
import { createButchCodesFile, readButchCodesFile } from "./utils.js"
import ButchObj from "./ButchObj.js"

createButchCodesFile("./.bch/ButchCodesSet.txt", "./.bch/");

const codes = readButchCodesFile("./.bch/ButchCodes.json")
const builder = new Butch.ButchBuilder(codes);

builder.encodeNamedProgram("./.bch/testProgram.json", () => {
    console.log("encoded");

    const file = fs.readFileSync("./.bch/testProgram.bch")
    const obj = JSON.parse(file.toString());
    
    console.log(obj);
    
    const program = builder.build(new ButchObj(obj, codes))
    
    console.log(program);

    program.execute();
});


