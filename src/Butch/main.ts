// import { FuncBlock, Environment, Block } from "./base"
import * as B from "./blocks"
import ExpressionBlock from "./ExpressionBlock"
import * as Butch from "./Butch"
import { createButchCodesFile, readButchCodes, readButchCodesSetAssets } from "./utils"
import ButchObj from "./ButchObj"
import rnfs from "react-native-fs"

let codes: any;
let builder: Butch.ButchBuilder;

async function testBchFile() {
    const namedTestProg = await rnfs.readFileAssets("bch/testProgram.json");
    const progStr = builder.encodeNamedProgram(namedTestProg)
    
    const bobj = new ButchObj(JSON.parse(progStr), codes);
    const program = builder.build(bobj);
    program.execute();
}

function manualTest() {
    const decVar = new B.DeclareBlock("var", new ExpressionBlock("0"));
    const forLoop = new B.ForBlock(
        new B.DeclareBlock("i", new ExpressionBlock("0")),
        new ExpressionBlock("i < 100"),
        new B.SetBlock(new ExpressionBlock("i"), new ExpressionBlock("i + 1")),
        [new B.SetBlock(new ExpressionBlock("var"), new ExpressionBlock("var + i"))]
    )
    const main = new B.FuncBlock([decVar, forLoop, 
        new B.__consolelog(new B._dereferenceBlock("var"))]);
    const prog = new Butch.Program();
    prog.useFunction("main", main);
    
    const start = Date.now();
    prog.execute();
    console.log(Date.now() - start);
}

readButchCodesSetAssets()
    .then(set => createButchCodesFile(set))
    .then(() => readButchCodes())
    .then(_codes => {
        codes = _codes;
        builder = new Butch.ButchBuilder(codes);
        manualTest();
    })

    
