import RuntimeError from "./errors.js"
import {v4 as idv4} from "uuid"

export enum TypeNames
{
    UNDEFINED = -Infinity,
    ANY = 0,
    PRIMITIVE = 1000,
    NUMBER = 1001, // primitives
    STRING = 1002,
    BOOLEAN = 1003,
    BLOCK = 2000, // blocks
    SCOPEBLOCK = 2001,
    FUNCKBLOCK = 2002,

    ARRAY = 3001,    
}

export class Value 
{
    static Undefined: Value = new Value(TypeNames.UNDEFINED)

    private value: any | Block | undefined;
    private typeName: TypeNames;

    constructor(typeName: TypeNames, value: any | undefined = undefined) {
        this.value = value;
        this.typeName = typeName;
    }

    evaluate(env: Environment, expectedTypeName: TypeNames,
        strict: boolean = false) : Object
    {
        if (this.typeName === TypeNames.ANY || expectedTypeName === TypeNames.ANY ||
            (!strict && 1000 > Math.abs(this.typeName - expectedTypeName) ||
            strict && this.typeName === expectedTypeName)) 
        {
            return this.value;
        } else {
            RuntimeError.throwTypeError(env, TypeNames[expectedTypeName], TypeNames[this.typeName]);
        }
    }

    getType() {
        return this.typeName;
    }

    assign(value: Value) {
        this.value = value.value;
        this.typeName = value.typeName;
    }
}

export enum SignalTypes {
    NULL = 0,
    BREAK = 1,
    RETURN = 2
}

export class Signal 
{
    public type: SignalTypes;
    public payload: Value;

    constructor(type: SignalTypes = SignalTypes.NULL, payload: Value = Value.Undefined) {
        this.type = type;
        this.payload = payload;
    }

    static readonly Default = new Signal();
}

export class Environment
{
    private localVariables: Map<string, Value>;
    
    public parenEnv: Environment | undefined;
    public readonly curScopeBlock: Block;
    public curBlock: Block;
    public signal: Signal = Signal.Default;

    constructor(ScopeBlock: Block, parenEnv: Environment | undefined = undefined) {
        this.curScopeBlock = ScopeBlock;
        this.curBlock = ScopeBlock;
        this.parenEnv = parenEnv;
        this.localVariables = new Map<string, Value>();
    }

    private find(name: string): Value | undefined {
        let value = this.localVariables.get(name);
        if (!value) 
            value = this.parenEnv?.find(name) ?? undefined;

        return value;
    }

    has(name: string): boolean {
        return this.find(name) !== undefined;
    }

    get(name: string): Value {
        let value = this.find(name) ?? RuntimeError.throwUndefinedError(this, name);
        return value;
    }

    create(name: string, value: Value) {
        if (this.localVariables.has(name))  
            RuntimeError.throwRedefineError(this, name);
        
        this.localVariables.set(name, value);
    }

    assign(name: string, value: Value) {
        let variable = this.find(name);
        variable?.assign(value) ?? RuntimeError.throwUndefinedError(this, name);
    }

    destriduteSignal() {
        if (this.parenEnv)
            this.parenEnv.signal = {...this.signal};
    }
}

export abstract class Block
{
    public _id: string = idv4();
    public index: number = NaN;
    private content: Block[] = [];

    protected abstract logicsBody(env : Environment): Value;

    execute(env : Environment): Value {
        const prevBlock = env.curBlock  // kostil'?
        env.curBlock = this;
        const result = this.logicsBody(env);
        env.curBlock = prevBlock;

        // console.log("Executed ", this._id, this.constructor, " result ", result);
        
        return result;
    }

    public getContent(): Block[] {
        return [...this.content];
    }

    public setContent(content: Block[]) {
        this.content = content;
        for (let i = 0; i < this.content.length; ++i)
            this.content[i].index = i;
    }

    public pushToContent(...blocks: Block[]) {
        let index = this.content.length;
        const newLenght = this.content.push(...blocks);
        for (; index < newLenght; ++index) {
            this.content[index].index = index;
        }

    }
}

/**
 * extends existing Environment with new local variables
 */
export abstract class ScopeBlock extends Block
{
    execute(env : Environment): Value {
        const newEnv = new Environment(this, env)
        const execResult = super.execute(newEnv);
        if (newEnv.signal.type !== SignalTypes.NULL) {
            newEnv.destriduteSignal();
        }
        return execResult;
    }
} 

export abstract class ContainerBlock extends ScopeBlock
{
    protected containerIndexes: number[];

    constructor(internalBlocks: Array<Block> = []) {
        super();
        this.setContent([...this.getContent(), ...internalBlocks]);
        this.containerIndexes = internalBlocks.map(block => block.index);
    }

    protected logicsBody(env: Environment): Value {
        // console.log("\t\tInto container ", this._id);
        const content = this.getContent();

        for (let i = 0; i < this.containerIndexes.length; ++i) {
            // console.log("\tExec : ", content[this.containerIndexes[i]]._id);
            
            content[this.containerIndexes[i]].execute(env);
            if (env.signal.type !== SignalTypes.NULL) break;
        }

        return Value.Undefined;
    }
}

export class FuncBlock extends ContainerBlock
{
    public argNames: Array<string>;
    
    constructor(internalBlocks: Array<Block> = [], argNames: Array<string> = []) {
        super(internalBlocks);
        this.argNames = argNames;
    }

    protected logicsBody(env: Environment): Value {
        super.logicsBody(env);
        // console.log(env.signal);
        if (env.signal.type === SignalTypes.RETURN) {
            return env.signal.payload;
        } else {
            return Value.Undefined;
        }
    }

    execute(env: Environment, args: Value[] = []): Value {
        if (args.length !== this.argNames.length) {
            RuntimeError.throwArgumentError(env);
        }

        const argsEnv = new Environment(this, env);
        for (let i = 0; i < args.length; ++i) {
            argsEnv.create(this.argNames[i], args[i]);
        }

        try {
            return super.execute(argsEnv);
        } catch (e: any) {
            if (e.logEnv) e.logEnv(env)
            throw e;
        }
    }
}