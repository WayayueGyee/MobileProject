import { Block } from "./base"
import * as Bch from "./Butch"

export class RuntimeError extends Error
{
    public blockIdStack: string[][] = [];
    public blockIndexStack: number[][] = [];

    constructor(where: Block, message: string) {
        super(message);
        // this.stack = ""; // comment this to see normal error call stack
        this.logBlockLocation(where);
    }

    logBlockLocation(where: Block) {
        const indexFrame = [], idFrame = [];
        let curBlock: Block | undefined = where;
        while (curBlock?.parent) {
            indexFrame.push(curBlock.index);
            idFrame.push(curBlock.id);
            curBlock = curBlock.parent;
        }
        this.blockIdStack.push(idFrame);
        this.blockIndexStack.push(indexFrame);
    }    

    static throwTypeError(where: Block, expected: string, had: string): never {
        let error = new RuntimeError(where, 
            `Expected ${expected}, but had ${had}`);
        error.name = "TypeError";
        throw error;
    } 
    
    static throwIdentifierError(where: Block, message: string): never {
        let error = new RuntimeError(where, message);
        error.name = "IdentifierError";
        throw error;
    }

    static throwInvalidNameError(where: Block): never {
        this.throwIdentifierError(where, "Invalid identifier name");
    }

    static throwUndefinedError(where: Block, referenceName: string): never {
        this.throwIdentifierError(where, `Symbol ${referenceName} is not defined`);
    }

    static throwRedefineError(where: Block, referenceName: string): never {
        this.throwIdentifierError(where, `Symbol ${referenceName} is already defined`);
    }

    static throwInvalidExpression(where: Block, message: string = "no details"): never {
        throw new RuntimeError(where, "Invalid expression syntax : " + message);
    }

    static throwArgumentError(where: Block): never {
        let error = new RuntimeError(where, "Invalid arguments");
        error.name = "ArgumentError";
        throw error;
    }

    static throwIndexError(where: Block): never {
        throw new RuntimeError(where, "Invalid index");
    }
}

export class CompilationError extends Error
{
    public errorLocation: Array<number>;

    constructor(message: string, info: Bch.BlockInfo | undefined = undefined) {
        if (info) {
            message += ` in Block ${JSON.stringify(info.obj.data, null, 4)}, located in [${info.location}]`;
        }
        super(message);
        this.errorLocation = (info ? info.location : []);
    }

    static throwSyntax(info: Bch.BlockInfo): never {
        throw new CompilationError("Invalid syntax", info);  
    }

    static throwUnknownBlock(info: Bch.BlockInfo): never {
        throw new CompilationError("Unknown Block", info);  
    }

    static throwInvalidFile(message: string = ""): never {
        throw new CompilationError("Invalid compiling file; " + message);
    }
}

export default RuntimeError;