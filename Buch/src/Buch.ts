import { FuncBlock, Block, Environment, Value, TypeNames } from "./base.js"
import { BreakBlock, DeclareBlock, ExpressionBlock, InvokeBlock, ReturnBlock, TextBlock, _dereferenceBlock } from "./blocks.js";
import { RuntimeError, CompilationError } from "./errors.js"; 
import { createBuchCodesFile } from "./utils.js";
import { syntaxCheck, prebuildInternalBlocks } from "./middleware.bch.js"

import * as fs from "fs"
import _path from "path"

export default class Program extends Block
{
    private globalEnv: Environment;

    constructor() {
        super();
        this.globalEnv = new Environment(this);
    }

    useGlobalVariable(declarator: DeclareBlock) {
        declarator.execute(this.globalEnv)
        return this;
    }

    useFunction(name: string, funcBlock: FuncBlock) {
        this.globalEnv.create(name, new Value(TypeNames.FUNCKBLOCK, funcBlock))
        return this;
    }

    protected logicsBody(env: Environment): Value {
        let main: any;
        try {
            main = env.get("main").evaluate(env, TypeNames.FUNCKBLOCK, true);
        } catch(e) {
            RuntimeError.throwIdentifierError(env, "Symbol 'main' must be defined as a function");
        }
        return main.execute(env);
    }

    execute(): Value {
        return super.execute(this.globalEnv);
    }
}

export type BuchObj = {
    [key: string]: any
}

// some named BuchObj types, used for example
export type _Declare = {
    type: "declare",
    name: string,
    content: BuchObj[1]
}
export type _Invoker = {
    type: "invoker",
    name: string,
    content: BuchObj[]
}

/**
 * recursive BuchObj finder 
 */
export function goToNode(obj: BuchObj, path: number[],
    codes: {[key: string]: string}) : BuchObj | undefined 
{
    let node = obj;
    for (let i = 0; i < path.length; ++i) {
        if (!node[codes.content]) return undefined;
        node = node[codes.content][path[i]];
    }
    return node
}

export type BlockInfo = {obj: BuchObj, location: number[]};

export type Middleware = (info: BlockInfo, codes: {[key: string]: string}, app: BuchBuilder) => void;

type Builder = (info: BlockInfo) => Block;

export type ExBuilder = (info: BlockInfo, codes: {[key: string]: string}, 
    app: BuchBuilder) => Block;
    
export class BuchBuilder
{
    static unknownBlockError: Error = new Error("Unknown block type to build");

    // codes dictionary 
    private c: {[key: string]: string};
    private builders: Map<string, Builder>;
    private exBuilders: Map<string, ExBuilder>;
    private middlewares: Middleware[];

    constructor(pathToBuchCodes: string) {
        this.c = JSON.parse(
            fs.readFileSync(pathToBuchCodes).toString());

        // bind default builders
        this.builders = new Map<string, Builder>([
            [this.c.invoker, this.buildInvoker],
            [this.c.declare, this.buildDeclare],
            [this.c.function, this.buildFunction],
            
            // style 2 builder : inline anonymos
            [this.c.expression, info => new ExpressionBlock(info.obj.value)],
            [this.c.text, info => new TextBlock(info.obj[this.c.value])],
            [this.c.deref, info => new _dereferenceBlock(info.obj[this.c.name])],
            [this.c.break, () => BreakBlock],
            [this.c.return, info => new ReturnBlock(info.obj.builtContent[0])]
        ]);

        this.exBuilders = new Map<string, ExBuilder>();
        this.middlewares = [syntaxCheck, prebuildInternalBlocks];
    }

    useBuilder(type: string, builder: ExBuilder) {
        if (!this.c[type]) throw BuchBuilder.unknownBlockError;
        this.exBuilders.set(this.c[type], builder);
    }

    useCode(name: string/*, code: number*/) {
        if (this.c[name]) throw new Error(`Code name "${name}" is already used`)
        this.c[name] = Object.keys(this.c).length.toString(16);
    }

    useMiddleware(middleware:  Middleware) {
        this.middlewares.push(middleware);
    }

    saveBuchCodes(pathToBuchDir: string) {
        const keys = Object.keys(this.c)
        let codesSet: string = keys[0];
        for (let i = 1; i < keys.length; ++i) {
            codesSet += "\n" + keys[i];
        }

        const pathToCodesSet = _path.join(pathToBuchDir, "BuchCodesSet.txt");
        fs.writeFile(pathToCodesSet, codesSet, () => {
            createBuchCodesFile(pathToCodesSet, pathToBuchDir);
        });
    }

    encodeNamedProgram(path: string, callback: (e: Error | null) => void) {
        fs.readFile(path, (err, data) => {
            if (err) throw err;
            else {
                let program = data.toString();
                
                Object.entries(this.c).forEach(([key, value]) => {
                    program = program.replace(new RegExp("\"" + key + "\"", "g"),
                        "\"" + value.toString() + "\"");
                    });

                fs.writeFile(
                    _path.join(_path.dirname(path), 
                        _path.basename(path).split(".")[0] + ".bch"), 
                    program.replace(new RegExp("[ \n\r]*", "g"), ""), 
                    callback
                );
            }
        })
    }

    private execMiddlewares(info: BlockInfo) {
        for (let i = 0; i < this.middlewares.length; ++i) {
            this.middlewares[i](info, this.c, this);
        }
    }

    // style 1 of builder : private prorety 
    private buildDeclare = (info: BlockInfo): DeclareBlock => {
        return new DeclareBlock(info.obj[this.c.name], info.obj.builtContent[0]);
    }

    private buildInvoker: Builder = (info: BlockInfo): Block => {
        return new InvokeBlock(info.obj[this.c.name], info.obj.builtContent);
    }

    private buildFunction = (info: BlockInfo): FuncBlock => {
        return new FuncBlock(info.obj.builtContent, info.obj[this.c.nameSeq]);
    }

    buildBlock(info: BlockInfo, useMiddlewares: boolean = true): Block {
        if (useMiddlewares) this.execMiddlewares(info);
        
        let builder = this.exBuilders.get(info.obj[this.c.type]);
        if (builder) {
            return builder(info, this.c, this);
        } else {
            let builder = this.builders.get(info.obj[this.c.type]);
            if (builder)
                return builder(info); 
        }
        CompilationError.throwUnknownBlock(info, this.c);
    }

    build(programObj: BuchObj): Program {
        const prog = new Program(); 
        const content = programObj[this.c.content];

        for (let i = 0; i < content.length; ++i) {
            const info = {obj: content[i], location: [i]};
            this.execMiddlewares(info);

            switch (content[i][this.c.type]) {
                case this.c.function:
                    prog.useFunction(content[i][this.c.name], 
                        this.buildFunction({obj: content[i], location: [i]}));
                    break;
                
                case this.c.declare:
                    prog.useGlobalVariable(this.buildDeclare(info));
            }
        }
        return prog;
    }

    getCodes(): {[key: string]: string} {
        return {...this.c};
    }
}

