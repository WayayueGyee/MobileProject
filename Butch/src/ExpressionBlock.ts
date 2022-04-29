import { Block, Environment, FuncBlock, TypeNames, Value } from "./base.js"
import { DeclareBlock, InvokeBlock, _dereferenceBlock, __consolelog } from "./blocks.js";
import Program from "./Butch.js";
import { RuntimeError } from "./errors.js"


const factorial = (function() {
    const cache = [1, 1]
    return function(n: number) {
        for (let i = cache.length, cur = cache[cache.length - 1]; i <= n; ++i) {
            cache.push(cur *= i);
        }
        return cache[n];
    }
})()

enum OpTypes {
    NUM = 0,
    STR = 1,
    BOOL = 2,
    ANY = 3,
    SYS = 4
}

const casters = new Map<TypeNames, Function>([
    [TypeNames.NUMBER, (env: Environment, val: Value) => Number(val.evaluate(env, TypeNames.NUMBER))],
    [TypeNames.STRING, (env: Environment, val: Value) => String(val.evaluate(env, TypeNames.STRING))],
    [TypeNames.BOOLEAN, (env: Environment, val: Value) => Boolean(val.evaluate(env, TypeNames.BOOLEAN))],
    [TypeNames.ANY, (env: Environment, val: Value) => val.evaluate(env, TypeNames.BOOLEAN)]
]);

type Op = { type: TypeNames, argsCount: number, prior: number, calc: (...args: any[]) => any };

const binNumericalOps: { [key: string]: { prior: number, calc: (...args: any[]) => any } } = {
    "-": { prior: 5, calc: (a, b) => a - b },
    "*": { prior: 4, calc: (a, b) => a * b },
    "/": { prior: 4, calc: (a, b) => a / b },
    "%": { prior: 4, calc: (a, b) => a % b },
    "//": { prior: 4, calc: (a, b) =>  Math.floor(a / b) },
    "^": { prior: 2, calc: (a, b) =>  a ** b },
};

const unNumericalOps: { [key: string]: { prior: number, calc: (...args: any[]) => any } } = {
    "'-": { prior: 3, calc: a => -a },
    "!": { prior: 2, calc: a => factorial(a) },
}

const binLogOps: { [key: string]: { prior: number, calc: (...args: any[]) => any } } = {
    "&&": { prior: 4, calc: (a, b) => a && b },
    "||": { prior: 5, calc: (a, b) => a || b },
}

// other operations 
const operations = new Map<string, Op>([
    ["+", { type: TypeNames.ANY, argsCount: 2, prior: 5, calc: (a, b) => a + b }],
    ["'+", { type: TypeNames.ANY, argsCount: 1, prior: 3, calc: a => a }],
    ["'!", { type: TypeNames.BOOLEAN, argsCount: 1, prior: 3, calc: a => !a }]
]);

Object.entries(binNumericalOps).forEach(([key, value]) => 
    operations.set(key, { type: TypeNames.NUMBER, argsCount: 2, ...value }));

Object.entries(unNumericalOps).forEach(([key, value]) => 
    operations.set(key, { type: TypeNames.NUMBER, argsCount: 1, ...value }));

Object.entries(binLogOps).forEach(([key, value]) => 
    operations.set(key, { type: TypeNames.BOOLEAN, argsCount: 2, ...value}))


function parseIdentifier(env: Environment, identifier: string): Value {
    if (identifier[0] === "\"" && identifier[identifier.length - 1] === "\"" ||
        identifier[0] === "\'" && identifier[identifier.length - 1] === "\'") {
        return new Value(TypeNames.STRING, identifier.substring(1, identifier.length - 1));
    } else if (Number.isFinite(Number(identifier))) {
        return new Value(TypeNames.NUMBER, Number(identifier));
    } else if (identifier === "true") {
        return new Value(TypeNames.BOOLEAN, true);
    } else if (identifier === "false") {
        return new Value(TypeNames.BOOLEAN, false);
    } else {
        return env.get(identifier);
    }
}

export default class ExpressionBlock extends Block 
{
    public expression: string;

    constructor(expression: string) {
        super();
        this.expression = expression;
    }

    protected parseExpression(env: Environment): any[] {
        const nst = this.expression.replaceAll(new RegExp("\\s+", "g"), "");
        let result: any[] = [];
        const stack: (Op | any)[] = [];

        function pushOp(op: Op) {
            while (stack.length > 0 && 
                op.prior >= stack[stack.length - 1].prior) {
                result.push(stack.pop());
            }
            stack.push(op);
        }

        function popUntil(flag: any) {
            while (stack.length && stack[stack.length - 1] !== flag) {
                result.push(stack.pop());
            }
            if (stack[stack.length - 1] === flag) stack.pop();
            else RuntimeError.throwInvalidExpression(env);
        }

        function calcEnum(start: number, endFlag: string): {end: number, result: Value[]} {
            let cur = start + 1;
            while (nst[cur] !== ")" && cur < nst.length) ++cur;
            const internalExps= nst.substring(i + 1, cur).split(",");

            const internalBlocks = internalExps.map(exp => new ExpressionBlock(exp));
            const result: Value[] = internalBlocks.map(block => block.execute(env));
            
            return {end: cur, result};
        }

        let i = 0, prefix = "'";
        while (i < nst.length) {
            let curSt = "";
            // reading  operand
            while (/\w|["']/.test(nst[i]) && i < nst.length) {
                curSt += nst[i++];
            }
            if (curSt) {
                result.push(parseIdentifier(env, curSt));
                curSt = "", prefix = "";
            } 

            if (i >= nst.length) break;

            // reading operation 
            let opName = "", j = i;
            while (!/\w/.test(nst[j]) && j < nst.length) {
                curSt += nst[j++];
                if (operations.has(curSt)) {
                    opName = curSt;
                }
            }
            i += opName.length;

            const op = operations.get(prefix + opName);
            if (!op && i < nst.length) {
                switch (nst[i]) {
                    case "(":
                        // function execution   don't work
                        if (prefix === "") {
                            const argsEnum = calcEnum(i, ")")
                            i = argsEnum.end;
                            result.push(argsEnum.result);

                            pushOp({type: TypeNames.ANY, prior: 1, argsCount: 2, calc: (funcVal, args) => 
                                funcVal.evaluate(env, TypeNames.FUNCKBLOCK, true).execute(env, args)
                            });
                        } else {
                            stack.push("("), ++i;
                            prefix = "'";
                        }
                        break;

                    case "[":
                        // array indexing 
                        if (prefix === "") {
                            pushOp({type: TypeNames.ANY, prior: 1, argsCount: 2, calc: (arrVal, indexVal) => 
                                arrVal.evaluate(env, TypeNames.ARRAY, true)[indexVal.evaluate(env, TypeNames.NUMBER)]
                            });
                            stack.push("["); ++i;
                            prefix = "'";
                        } else { // array literals      don't work
                            const arrEnum = calcEnum(i, "]");
                            i = arrEnum.end;
                            result.push(new Value(TypeNames.ARRAY, arrEnum.result));
                        }
                        break;

                    case ")":
                        popUntil("("); ++i;
                        prefix = "";
                        break;

                    case "]":
                        popUntil("["); ++i;
                        prefix = "";
                        break;
                
                    default:
                        RuntimeError.throwInvalidExpression(env);
                }
            } else if (!op) {
                RuntimeError.throwInvalidExpression(env);
            } else {
                pushOp(op);
                prefix = "'";
            }
        }

        while (stack.length) {
            result.push(stack.pop());
        }
        
        return result;
    }

    protected logicsBody(env: Environment): Value {
        const parsed = this.parseExpression(env);
    
        const stack: Value[] = [];
        for (let i = 0; i < parsed.length; ++i) {
            if (parsed[i] instanceof Value) {
                stack.push(parsed[i]);
            } else {
                const op: Op = parsed[i];
                let args: Value[] = [];

                const caster = casters.get(op.type);
                for (let j = 0; j < op.argsCount; ++j) {
                    args = [caster ? caster(env, stack.pop()) : stack.pop(), ...args];
                }
                stack.push(new Value(op.type, op.calc(...args)));
            }
        }
        return stack[0]; 
    }
}
