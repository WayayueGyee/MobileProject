import "react-native-get-random-values" // for uuid
import RuntimeError from "./errors"
import {v4 as idv4} from "uuid"

export enum TypeNames
{
    UNDEFINED = -Infinity,
    ANY = 0,

    PRIMITIVE = 1000, 
    NUMBER = 1001, 
    STRING = 1002,
    BOOLEAN = 1003,

    BLOCK = 2000, 
    SCOPEBLOCK = 2001,
    FUNCKBLOCK = 2002,

    ARRAY = 3001,    
    VALUE = 4001
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

    public static isCompatible(type1: TypeNames, type2: TypeNames, strict: boolean = false): boolean {
        return type1 === TypeNames.ANY || type2 === TypeNames.ANY ||
            (!strict && 1000 > Math.abs(type1 - type2) || strict && type1 === type2);
    }

    evaluate(env: Environment, expectedTypeName: TypeNames,
        strict: boolean = false) : Object
    {
        if (Value.isCompatible(this.typeName, expectedTypeName, strict)) 
        {
            return this.value;
        } else {
            RuntimeError.throwTypeError(env.curBlock, 
                TypeNames[expectedTypeName], TypeNames[this.typeName]);
        }
    }

    getType() {
        return this.typeName;
    }

    assign(value: Value): Value {
        this.value = value.value;
        this.typeName = value.typeName;
        return this;
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

    constructor(type: SignalTypes = SignalTypes.NULL, 
        payload: Value = Value.Undefined) {
        this.type = type;
        this.payload = payload;
    }

    static readonly Default = new Signal();
}

export class Environment
{
    private localVariables: Map<string, Value> = new Map<string, Value>();
    
    public readonly parenEnv: Environment | undefined;
    public signal: Signal = Signal.Default;
    public curBlock: Block;

    constructor(where: Block, parenEnv: Environment | undefined = undefined) {
        this.parenEnv = parenEnv;
        this.curBlock = where;
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
        let value = this.find(name) 
            ?? RuntimeError.throwUndefinedError(this.curBlock, name);
        return value;
    }

    create(name: string, value: Value) {
        if (this.localVariables.has(name))  
            RuntimeError.throwRedefineError(this.curBlock, name);
        
        this.localVariables.set(name, value);
    }

    assign(name: string, value: Value) {
        let variable = this.find(name);
        variable?.assign(value) 
            ?? RuntimeError.throwUndefinedError(this.curBlock, name);
    }

    destriduteSignal() {
        if (this.parenEnv)
            this.parenEnv.signal = {...this.signal};
    }
}

export abstract class Block
{
    public readonly id: string = idv4(); 
    
    private content: Block[] = [];
    
    private _index : number = NaN;
    public get index() : number {
        return this._index;
    }
    public set index(v : number) {
        this._index = v;
    }

    private _parent : Block | undefined = undefined;
    public get parent() : Block | undefined {
        return this._parent;
    }
    public set parent(v : Block | undefined) {
        this._parent = v;
    }

    protected abstract logicsBody(env : Environment): Value;

    execute(env : Environment): Value {
        const prevBlock = env.curBlock;
        env.curBlock = this;
        const result = this.logicsBody(env);
        env.curBlock = prevBlock;
        
        return result;
    }

    protected updateContent(begin: number, end: number): number[] {
        const indexes = [];
        for (let i = begin; i < end; ++i) {
            indexes.push(i);
            this.content[i].index = i;
            this.content[i].parent = this;
        }   
        return indexes;
    }

    public getContent(): Block[] {
        return [...this.content];
    }

    /**
     * @returns indexes in content of that blocks 
     */
    public setContent(content: Block[]): number[] {
        this.content = content;
        return this.updateContent(0, content.length);
    }

    /**
     * @returns indexes in content of that new blocks 
     */
    public pushToContent(...blocks: Block[]): number[] {
        let oldLenght = this.content.length;
        const newLenght = this.content.push(...blocks);
        return this.updateContent(oldLenght, newLenght);
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

export class ContainerBlock extends ScopeBlock
{
    protected containerIndexes: number[];

    constructor(internalBlocks: Array<Block> = []) {
        super();
        this.containerIndexes = this.pushToContent(...internalBlocks);
    }

    protected logicsBody(env: Environment): Value {
        const content = this.getContent();

        for (let i = 0; i < this.containerIndexes.length; ++i) {    
            content[this.containerIndexes[i]].execute(env);
            if (env.signal.type !== SignalTypes.NULL) break;
        }

        return Value.Undefined;
    }
}
