import { Block, Environment, Value, TypeNames, Signal, SignalTypes, ContainerBlock } from "./base";
import ExpressionBlock from "./ExpressionBlock";
import { verifyVariableName } from "./utils";
import RuntimeError from "./errors";

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


export class FuncBlock extends ContainerBlock
{
    public argNames: Array<string>;
    
    constructor(internalBlocks: Array<Block> = [], argNames: Array<string> = []) {
        super(internalBlocks);
        this.argNames = argNames;
    }

    protected logicsBody(env: Environment): Value {
        super.logicsBody(env);
        if (env.signal.type === SignalTypes.RETURN) {
            return env.signal.payload;
        } else {
            return Value.Undefined;
        }
    }

    execute(env: Environment, args: Value[] = []): Value {
        if (args.length !== this.argNames.length) {
            RuntimeError.throwArgumentError(this);
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

export class InvokeBlock extends Block
{
    public targetName: string;
    private argumentIndexes: number[];

    constructor(targetName: string = "", argumentBlocks: Array<Block> = []) 
    {
        super();
        this.targetName = targetName;
        this.argumentIndexes = this.pushToContent(...argumentBlocks);
    }

    protected logicsBody(env: Environment): Value {
        const target: any = env.get(this.targetName).evaluate(env, TypeNames.FUNCKBLOCK, true);
        const content = this.getContent();
        const args: Value[] = new Array<Value>(this.argumentIndexes.length);

        for (let i = 0; i < args.length; ++i) {
            args[i] = content[i].execute(env);
        }

        return target.execute(env, args);
    }

    execute(env: Environment): Value {
        try {
            return super.execute(env);
        } catch(e: any) {
            if (e.logBlockLocation) {
                e.logBlockLocation(this);
            }
            throw e;
        }
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
        this.initBlockIndex = this.pushToContent(initBlock)[0];
    }

    protected logicsBody(env: Environment): Value {
        const value: Value = this.getContent()[this.initBlockIndex].execute(env);
        
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
    private outBlockIndex: number | undefined;

    constructor(outBlock: Block | undefined) {
        super();
        if (outBlock){
            this.outBlockIndex = this.pushToContent(outBlock)[0];
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
    private targetIndex: number;

    constructor(target: Block) {
        super();
        this.targetIndex = this.pushToContent(target)[0];
    }

    protected logicsBody(env: Environment): Value {
        console.log(
            "//////////////////\n", 
            this.getContent()[this.targetIndex].execute(env), 
            "\n//////////////////");

        return Value.Undefined;
    }
    
}

export class SetBlock extends Block
{
    public leftValueIndex: number;
    public rightBlockIndex: number;

    constructor(leftValue: Block, rightValue: Block) {
        super();
        this.leftValueIndex = this.pushToContent(leftValue)[0];
        this.rightBlockIndex = this.pushToContent(rightValue)[0];
    }

    protected logicsBody(env: Environment): Value {
        const content = this.getContent();
        const leftvalue: Value = content[this.leftValueIndex].execute(env);
        const rightValue: Value = content[this.rightBlockIndex].execute(env);
        
        leftvalue.assign(rightValue);
        return leftvalue;
    }
}

export class WhileBlock extends ContainerBlock 
{
    private conditionIndex: number;

    constructor(condition: ExpressionBlock, internalBlocks: Block[]) {
        super(internalBlocks);
        this.conditionIndex = this.pushToContent(condition)[0];
    }

    protected logicsBody(env: Environment): Value {
        const condition = this.getContent()[this.conditionIndex];
        
        while (condition.execute(env).evaluate(env, TypeNames.BOOLEAN)) {
            super.logicsBody(env);
        }
        return Value.Undefined;
    }
}

export class ForBlock extends WhileBlock 
{
    private beforeIndex: number;
    private afterIndex: number;

    constructor(beforeLoopBlock: Block, condition: ExpressionBlock,
        afterItBlock: Block, internalBlocks: Block[]) {
        super(condition, internalBlocks);
        this.beforeIndex = this.pushToContent(beforeLoopBlock)[0];
        this.afterIndex = this.pushToContent(afterItBlock)[0];

        this.containerIndexes.push(this.afterIndex);
    }

    protected logicsBody(env: Environment): Value {
        const content = this.getContent();
        content[this.beforeIndex].execute(env);
        return super.logicsBody(env);
    }
}