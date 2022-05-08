// import { FuncBlock, Environment, Block } from "./base"
import { ContainerBlock } from "./base"
import * as B from "./blocks"
import ExpressionBlock from "./ExpressionBlock"
import { ButchBuilder, Program } from "./Butch"
import { createButchCodesFile, readButchCodes, readButchCodesSetAssets } from "./utils"
import ButchObj from "./ButchObj"
import rnfs from "react-native-fs"

export async function testBchFile(builder: ButchBuilder) {
    const namedTestProg = await rnfs.readFileAssets("bch/testProgram.json");
    const progStr = builder.encodeNamedProgram(namedTestProg)
    
    const bobj = new ButchObj(JSON.parse(progStr), builder.getCodes());
    
    const program = builder.build(bobj);
    try {
        program.execute();
    } catch (e: any) {
        console.log("Finished with exeption :\nIn ", e.blockIndexStack, "\n", e);
    }
}

function manualTest() {
    const decVar = new B.DeclareBlock("var", new ExpressionBlock("0"));
    const forLoop = new B.ForBlock(
        new B.DeclareBlock("i", new ExpressionBlock("0")),
        new ExpressionBlock("i < 10000"),
        new B.SetBlock(new ExpressionBlock("i"), new ExpressionBlock("i + 1")),
        new ContainerBlock([new B.SetBlock(new ExpressionBlock("var"), new ExpressionBlock("var + i"))])
    )
    const main = new B.FuncBlock([decVar, forLoop, 
        new B.__consolelog(new B._dereferenceBlock("var"))]);
    const prog = new Program();
    prog.useFunction("main", main);
    
    prog.execute();
}

export function initDefaultBuilder() {
    return readButchCodesSetAssets()
        .then(set => createButchCodesFile(set))
        .then(() => readButchCodes())
        .then(_codes => new ButchBuilder(_codes))
}