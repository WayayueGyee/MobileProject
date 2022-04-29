import { FuncBlock, Environment, Block } from "./base.js"
import { DeclareBlock, InvokeBlock, TextBlock, _dereferenceBlock } from "./blocks.js"
import * as Butch from "./Butch.js"
import * as fs from "fs"
import { createButchCodesFile, readButchCodesFile } from "./utils.js"
import ButchObj from "./ButchObj.js"

createButchCodesFile("./.bch/ButchCodesSet.txt", "./.bch/");

const codes = readButchCodesFile("./.bch/ButchCodes.json")
const builder = new Butch.ButchBuilder(codes);

export function test() {
    const file = fs.readFileSync("./.bch/testProgram.bch");
    const bobj = new ButchObj(JSON.parse(file.toString()), codes);
    
    const program = builder.build(bobj);
    program.execute();

    // bobj.goTo(2, 0).content()[0] = {[codes.type]: codes.text, [codes.value]: "__newValue__"};
    // builder.rebuild(program, bobj, [[2, 0]]);
    // console.log("\n\tAfter rebuilding : ");
    // program.execute();
}

builder.encodeNamedProgram("./.bch/testProgram.json", () => {
    console.log("encoded");
    test();
});

// test();
