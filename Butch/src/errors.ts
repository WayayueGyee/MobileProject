import { Environment, Block } from "./base.js"
import * as Bch from "./Butch.js"

export class RuntimeError extends Error
{
    public blockIdStack: Array<string> = [];
    public blockIndexStack: Array<number> = [];

    constructor(env: Environment, message: string) {
        super(message);
        // this.stack = ""
        let curEnv: Environment | undefined = env;
        while (curEnv) {
            this.pushBackCallStack(curEnv.curBlock);
            curEnv = curEnv.parenEnv; 
        }
    }

    pushBackCallStack(block: Block) {
        this.stack += `\nIn Block ${block._id}`;
        this.blockIdStack.push(block._id);
        this.blockIndexStack.push(block.index);
    }

    static throwTypeError(env: Environment, expected: string, had: string): never {
        let error = new RuntimeError(env, 
            `Expected ${expected}, but had ${had}`);
        error.name = "TypeError";
        throw error;
    } 
    
    static throwIdentifierError(env: Environment, message: string): never {
        let error = new RuntimeError(env, message);
        error.name = "IdentifierError";
        throw error;
    }

    static throwInvalidNameError(env: Environment): never {
        this.throwIdentifierError(env, "Invalid identifier name");
    }

    static throwUndefinedError(env: Environment, referenceName: string): never {
        this.throwIdentifierError(env, `Symbol ${referenceName} is not defined`);
    }

    static throwRedefineError(env: Environment, referenceName: string): never {
        this.throwIdentifierError(env, `Symbol ${referenceName} is already defined`);
    }

    static throwArgumentError(env: Environment): never {
        let error = new RuntimeError(env, "Invalid arguments");
        error.name = "ArgumentError";
        throw error;
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
}

export default RuntimeError;