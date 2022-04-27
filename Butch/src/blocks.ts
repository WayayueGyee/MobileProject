import { FuncBlock, ScopeBlock, Block, Environment, Value, TypeNames, Signal, SignalTypes } from "./base.js";
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

    protected logicsBody(env: Environment): Value {
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
        if (this.arguments.length !== target.argNames.length)
            RuntimeError.throwArgumentError(env);

        let newEnv = new Environment(target);
        for (let i = 0; i < this.arguments.length; ++i) {
            newEnv.create(target.argNames[i], this.arguments[i].execute(env));
        }

        return target.execute(newEnv);
    }

    execute(env: Environment): Value {
        try {
            return super.execute(env);
        } catch(e: any) {
            e?.pushBackCallStack(this._id);
            throw e;
        }
    }
}

export class DeclareBlock extends Block
{
    public variableName: string;
    public initBlock: Block;

    constructor(variableName: string, initBlock: Block) 
    {
        super();
        this.variableName = variableName;
        this.initBlock = initBlock;
        this.pushToContent(initBlock);
    }

    protected logicsBody(env: Environment): Value {
        const value: Value = this.initBlock.execute(env);

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

export class ExpressionBlock extends Block 
{
    public expression: string;

    constructor(expression: string) {
        super();
        this.expression = expression;
    }

    protected logicsBody(env: Environment): Value {
        
        // ToDo:
        //  arithmetic and logic calculations 
        //  with supported variable's identifiers dereferencing
        return Value.Undefined;        
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
    public outBlock: Block | undefined;

    constructor(outBlock: Block | undefined) {
        super();
        if (outBlock){
            this.outBlock = outBlock;
            this.pushToContent(outBlock);
        }
    }

    protected logicsBody(env: Environment): Value {
        env.signal = new Signal(SignalTypes.RETURN, 
            this.outBlock ? this.outBlock.execute(env) : Value.Undefined);
        return Value.Undefined;
    }
}