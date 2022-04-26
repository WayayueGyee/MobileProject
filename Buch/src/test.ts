import { FuncBlock, Environment, Block } from "./base.js"
import { DeclareBlock, InvokeBlock, TextBlock, _dereferenceBlock } from "./blocks.js"
import * as Buch from "./Buch.js"
import * as fs from "fs"
import { createBuchCodesFile } from "./utils.js"

createBuchCodesFile("./.bch/BuchCodesSet.txt", "./.bch/");

const builder = new Buch.BuchBuilder("./.bch/BuchCodes.json");

builder.encodeNamedProgram("./.bch/testProgram.json", () => {
    console.log("encoded");

    const file = fs.readFileSync("./.bch/testProgram.bch")
    const obj = JSON.parse(file.toString());
    
    console.log(obj);
    
    const program = builder.build(obj)
    
    console.log(program);

    program.execute();
});


