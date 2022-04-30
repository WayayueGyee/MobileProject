// Darnger Zone :
//      "govnina-code"

import { Block, Environment, TypeNames, Value } from "./base.js"
import { _dereferenceBlock, __consolelog } from "./blocks.js";
import { RuntimeError } from "./errors.js"


const factorial = (function() {
    const cache = [1, 1]
    const cacheMax = 170; // >170! in js = INF
    return function(n: number) {
        if (n > cacheMax) return Infinity;
        for (let i = cache.length, cur = cache[cache.length - 1]; i <= n; ++i) {
            cache.push(cur *= i);
        }
        return cache[n];
    }
})()

// need to be replaced in "Value" class 
const casters = new Map<TypeNames, Function>([
    [TypeNames.NUMBER, (env: Environment, val: Value) => Number(val.evaluate(env, TypeNames.NUMBER))],
    [TypeNames.STRING, (env: Environment, val: Value) => String(val.evaluate(env, TypeNames.STRING))],
    [TypeNames.BOOLEAN, (env: Environment, val: Value) => Boolean(val.evaluate(env, TypeNames.BOOLEAN))],
    [TypeNames.PRIMITIVE, (env: Environment, val: Value) => 
        val.getType() === TypeNames.ANY || Math.abs(val.getType() - TypeNames.PRIMITIVE) < 1000 ? 
            val.evaluate(env, TypeNames.ANY) 
            : RuntimeError.throwTypeError(env, "primitive", "array")
    ],
    [TypeNames.ANY, (env: Environment, val: Value) => val.evaluate(env, TypeNames.ANY)],
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
    "&&": { prior: 9, calc: (a, b) => a && b },
    "||": { prior: 10, calc: (a, b) => a || b },
    "==": { prior: 8, calc: (a, b) => a == b },
    "!=": { prior: 8, calc: (a, b) => a != b },
    "<": { prior: 7, calc: (a, b) => a < b },
    "<=": { prior: 7, calc: (a, b) => a <= b },
    ">": { prior: 7, calc: (a, b) => a > b },
    ">=": { prior: 7, calc: (a, b) => a >= b },
}

// other operations 
const operations = new Map<string, Op>([
    ["+", { type: TypeNames.PRIMITIVE, argsCount: 2, prior: 5, calc: (a, b) => a + b}],
    ["'+", { type: TypeNames.ANY, argsCount: 1, prior: 3, calc: a => a }],
    ["'!", { type: TypeNames.BOOLEAN, argsCount: 1, prior: 3, calc: a => !a }],
    // array kostil' 
    [",", { type: TypeNames.ANY, argsCount: 2, prior: 13, calc: (a, b) => {
        let arr = (a instanceof Array) ? a : [new Value(TypeNames.ANY, a)];
        if (b instanceof Array)
            arr.push(...b);
        else arr.push(new Value(TypeNames.ANY, b));
        return arr;
    }}]
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
                            pushOp({type: TypeNames.ANY, prior: 1, argsCount: 2, calc: (func, args) => {
                                
                                return func.execute(env, args).evaluate(env, TypeNames.ANY);
                            }});
                            result.push(new Value(TypeNames.ARRAY, []));
                            stack.push("(", operations.get(","));
                            prefix = "'";
                            ++i;
                        } else {
                            stack.push("("), ++i;
                            prefix = "'";
                        }
                        break;

                    case "[":
                        // array indexing 
                        if (prefix === "") {
                            pushOp({type: TypeNames.ANY, prior: 1, argsCount: 2, calc: (arr, index) => {
                                if (index && arr instanceof Array) {
                                    return (arr[index] 
                                        ?? RuntimeError.throwIndexError(env)).evaluate(env, TypeNames.ANY);
                                } 
                                else RuntimeError.throwInvalidExpression(env);
                            }});
                        } 
                        stack.push("["); ++i;
                        prefix = "'";
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
                if (opName !== "!") prefix = "'";
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
                    const arg = caster ? caster(env, stack.pop()) : stack.pop();
                    
                    if (arg === undefined) RuntimeError.throwInvalidExpression(env);
                    else args = [arg, ...args];
                };
                
                stack.push(new Value(op.type, op.calc(...args)));
            }
        }
        
        return stack[0]; 
    }
}
