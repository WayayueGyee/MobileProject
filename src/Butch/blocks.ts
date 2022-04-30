import { Block, Environment, Value, TypeNames, Signal, SignalTypes } from "./base.js";
import RuntimeError from "./errors.js";
import { verifyVariableName } from "./utils.js";

/**
 * placeholder | text input
 * must be noexept
 */
export class TextBlock extends Block
 {
    public text: string;

    constructor(text: string = "") {
        super();
        this.text = text;
    }

    protected override logicsBody(): Value {
        return new Value(TypeNames.STRING, this.text);
    }
}

export class InvokeBlock extends Block
{
    public targetName: string;
    public arguments: Array<Block>;

    constructor(targetName: string = "", argumentBlocks: Array<Block> = []) 
    {
        super();
        this.targetName = targetName;
        this.arguments = argumentBlocks;
        this.pushToContent(...argumentBlocks);
    }

    protected logicsBody(env: Environment): Value {
        const target: any = env.get(this.targetName).evaluate(env, TypeNames.FUNCKBLOCK, true);

        const args: Value[] = new Array<Value>(this.arguments.length);
        for (let i = 0; i < args.length; ++i) {
            args[i] = this.arguments[i].execute(env);
        }

        return target.execute(env, args);
    }

    execute(env: Environment): Value {
        return super.execute(env);
    }
}

export class DeclareBlock extends Block
{
    public variableName: string;
    public initBlockIndex: number;

    constructor(variableName: string, initBlock: Block) 
    {
        super();
        this.variableName = variableName;
        this.pushToContent(initBlock);
        this.initBlockIndex = initBlock.index;
    }

    protected logicsBody(env: Environment): Value {
        const content = this.getContent();
        const value: Value = content[this.initBlockIndex].execute(env);

        if (!verifyVariableName(this.variableName)) 
            RuntimeError.throwInvalidNameError(env);
        
        env.create(this.variableName, value);
        return value;
    }
} 

export class _dereferenceBlock extends Block
{
    public variableName: string;

    constructor(variableName: string) {
        super();
        this.variableName = variableName;
    }

    protected logicsBody(env: Environment): Value {
        return env.get(this.variableName);
    }
}

export const BreakBlock = new (class extends Block {
    protected logicsBody(env: Environment): Value {
        env.signal = new Signal(SignalTypes.BREAK, Value.Undefined);
        return Value.Undefined;
    }
})()

export class ReturnBlock extends Block 
{
    public outBlockIndex: number | undefined;

    constructor(outBlock: Block | undefined) {
        super();
        if (outBlock){
            this.pushToContent(outBlock);
            this.outBlockIndex = outBlock.index;
        }
    }

    protected logicsBody(env: Environment): Value {
        const content = this.getContent();
        env.signal = new Signal(SignalTypes.RETURN, 
            this.outBlockIndex !== undefined ? content[this.outBlockIndex].execute(env) : Value.Undefined);
        return Value.Undefined;
    }
}

export class __consolelog extends Block 
{
    public target: Block;

    constructor(target: Block) {
        super();
        this.pushToContent(target)
        this.target = target;
    }

    protected logicsBody(env: Environment): Value {
        console.log("//////////////////\n", this.target.execute(env), "\n//////////////////");
        return Value.Undefined;
    }
    
}