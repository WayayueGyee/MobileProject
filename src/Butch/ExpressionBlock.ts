// Darnger Zone :
//      "govnina-code"

import { Block, Environment, TypeNames, Value } from "./base"
import { _dereferenceBlock, __consolelog } from "./blocks";
import { RuntimeError } from "./errors"


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

const primitiveCaster = (env: Environment, val: Value) => {
    const dTypeVal = Math.abs(val.getType() - TypeNames.PRIMITIVE);
    if (val.getType() === TypeNames.ANY || (dTypeVal < 1000 && dTypeVal >= 0)) { 
        return val.evaluate(env, TypeNames.ANY) 
    } else { 
        RuntimeError.throwTypeError(env.curBlock, "primitive", TypeNames[val.getType()])
    }
}

// need to be replaced in "Value" class 
const casters = new Map<TypeNames, Function>([
    [TypeNames.NUMBER, (env: Environment, val: Value) => Number(val.evaluate(env, TypeNames.NUMBER))],
    [TypeNames.STRING, (env: Environment, val: Value) => String(val.evaluate(env, TypeNames.STRING))],
    [TypeNames.BOOLEAN, (env: Environment, val: Value) => Boolean(val.evaluate(env, TypeNames.BOOLEAN))],
    [TypeNames.PRIMITIVE, primitiveCaster],
    [TypeNames.ANY, (env: Environment, val: Value) => val.evaluate(env, TypeNames.ANY)],
]);

type Op = { type: TypeNames, argsCount: number, prior: number, 
    rightSide?: boolean,
    symbol?: string,
    calc: (...args: any[]) => any };

const binNumericalOps: { [key: string]: 
    { prior: number, calc: (...args: any[]) => any, rightSide?: boolean } } = {
        "-": { prior: 5, calc: (a, b) => a - b },
        "*": { prior: 4, calc: (a, b) => a * b },
        "/": { prior: 4, calc: (a, b) => a / b },
        "%": { prior: 4, calc: (a, b) => a % b },
        "//": { prior: 4, calc: (a, b) =>  Math.floor(a / b) },
        "^": { prior: 2, calc: (a, b) =>  a ** b, rightSide: true },
};

const unNumericalOps: { [key: string]: 
    { prior: number, calc: (...args: any[]) => any, rightSide?: boolean } } = {
        "'-": { prior: 3, calc: a => -a },
        "!": { prior: 2, calc: a => factorial(a), rightSide: true },
        // "++": { prior: 2, calc: a => ++a },
        // "--": { prior: 2, calc: a => --a },
        // "'++": { prior: 3, calc: a => ++a },
        // "'--": { prior: 3, calc: a => --a },
}

const binLogOps: { [key: string]: { prior: number, calc: (...args: any[]) => any } } = {
    "&&": { prior: 9, calc: (a, b) => a && b },
    "||": { prior: 10, calc: (a, b) => a || b },
}

const binMixedOps: { [key: string]: { prior: number, calc: (...args: any[]) => any } } = {
    "==": { prior: 8, calc: (a, b) => a == b },
    "!=": { prior: 8, calc: (a, b) => a != b },
    "<": { prior: 7, calc: (a, b) => a < b },
    "<=": { prior: 7, calc: (a, b) => a <= b },
    ">": { prior: 7, calc: (a, b) => a > b },
    ">=": { prior: 7, calc: (a, b) => a >= b },
}

/** static operations  */ 
const operations = new Map<string, Op>([
    // other operations 
    ["+", { type: TypeNames.PRIMITIVE, argsCount: 2, prior: 5, calc: (a, b) => a + b}],
    ["'+", { type: TypeNames.ANY, argsCount: 1, prior: 3, calc: a => a }],
    ["'!", { type: TypeNames.BOOLEAN, argsCount: 1, prior: 3, calc: a => !a }],
    ["=", { type: TypeNames.VALUE, argsCount: 2, prior: 12, calc: (a, b) => a.assign(b) }],
    // array kostil' 
    [",", { type: TypeNames.ANY, argsCount: 2, prior: 13, symbol: ",", rightSide: true,
        // deprecated 
        calc: (a, b) => {
            console.warn("Used deprecated comma behavior in expressions");
            
            let arr = (a instanceof Array) ? a : [new Value(TypeNames.ANY, a)];
            if (b instanceof Array)
                arr.push(...b);
            else arr.push(new Value(TypeNames.ANY, b));
            return arr;
        }
    }]
]);

Object.entries(binNumericalOps).forEach(([key, value]) => 
    operations.set(key, { type: TypeNames.NUMBER, argsCount: 2, ...value }));

Object.entries(unNumericalOps).forEach(([key, value]) => 
    operations.set(key, { type: TypeNames.NUMBER, argsCount: 1, ...value }));

Object.entries(binLogOps).forEach(([key, value]) => 
    operations.set(key, { type: TypeNames.BOOLEAN, argsCount: 2, ...value }))

Object.entries(binMixedOps).forEach(([key, value]) => 
    operations.set(key, { type: TypeNames.ANY, argsCount: 2, ...value }))

const useInvokeOp = (env: Environment): Op => {
    return { type: TypeNames.ANY, prior: 1, argsCount: 2, 
        calc: (func, args) => 
            func.execute(env, args).evaluate(env, TypeNames.ANY) }
};

const useIndexOp = (env: Environment): Op =>{;
    return { type: TypeNames.ANY, prior: 1, argsCount: 2, 
        calc: (arr, index) => {
            if (Number.isFinite(index) && arr instanceof Array) {
                return (arr[index] 
                    ?? RuntimeError.throwIndexError(env.curBlock))//.evaluate(env, TypeNames.ANY);
            } 
            else RuntimeError.throwInvalidExpression(env.curBlock, 
                `expected 'Array[number]', had ${typeof(arr)}[${typeof(index)}]`);
    }}
} 

const useArrayCreateOp = (size: number): Op => {
    return { type: TypeNames.ARRAY, symbol: "[]", prior: 13,
        argsCount: size, calc: (...args: Value[]) => args || [] }
} 

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
    private parsed: any[] | undefined;

    constructor(expression: string) {
        super();
        this.expression = expression;
    }

    protected parseExpression(env: Environment): any[] {
        const nst = this.expression.replace(new RegExp("\\s+", "g"), "");
        let result: any[] = [];
        let stack: (Op | any)[] = [];

        function pushOp(op: Op) {
            while (stack.length > 0 && (
                op.prior > stack[stack.length - 1].prior || 
                !op.rightSide && op.prior === stack[stack.length - 1].prior)) {
                result.push(stack.pop());
            }
            stack.push(op);
        }

        function popUntil(flag: any) {
            while (stack.length && stack[stack.length - 1] !== flag) {
                result.push(stack.pop());
            }
            if (stack[stack.length - 1] === flag) stack.pop();
            else RuntimeError.throwInvalidExpression(env.curBlock, "Can't find flag " + flag);
        }

        function assembleCommas() {
            const newStack: (Op | any)[] = []
            let count = 0, emptyArr = false;
            for (let i = 0; i < stack.length; ++i) {
                if (stack[i].symbol == ",") ++count;
                else if (stack[i].symbol === "[]") {
                    emptyArr = stack[i].argsCount === 0;
                    count += stack[i].argsCount;
                } else {
                    if (count || emptyArr) {
                        newStack.push(useArrayCreateOp(count))
                        count = 0;
                        emptyArr = false;
                    }
                    newStack.push(stack[i]);
                }
            }
            if (count || emptyArr) {
                newStack.push(useArrayCreateOp(count))
            }
            stack = newStack;
        }

        let i = 0, prefix = "'";
        while (i < nst.length) {
            
            let curSt = "";
            // reading  operand
            for (; i < nst.length && (/\w|["']/.test(nst[i]) 
                || curSt[0] === "'" || curSt[0] === '"'); ++i) 
            {
                curSt += nst[i];
                if (curSt.length > 1 && (nst[i] === "'" && curSt[0] === "'" 
                    || nst[i] === '"' && curSt[0] === '"')) {
                        ++i;
                        break;
                    }
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
                        if (prefix === "") {
                            pushOp(useInvokeOp(env));
                            
                            stack.push("(", useArrayCreateOp(nst[i + 1] !== ")" ? 1 : 0));
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
                            pushOp(useIndexOp(env));
                            stack.push("["); 
                        } else {
                            stack.push("["); 
                            pushOp(useArrayCreateOp(nst[i + 1] !== "]" ? 1 : 0));
                        }
                        ++i;
                        prefix = "'";
                        break;

                    case ")":
                        assembleCommas();
                        popUntil("("); ++i;
                        prefix = "";
                        break;

                    case "]":
                        assembleCommas();
                        popUntil("["); ++i;
                        prefix = "";
                        break;
                
                    default:
                        RuntimeError.throwInvalidExpression(env.curBlock, "Unknown operator after " + i.toString());
                }
            } else if (!op) {
                RuntimeError.throwInvalidExpression(env.curBlock, "Unknown operator after " + i.toString());
            } else {
                pushOp(op);
                if (!op.rightSide) prefix = "'";
            }
        }

        assembleCommas();
        while (stack.length) {
            result.push(stack.pop());
        }
        
        return result;
    }

    protected logicsBody(env: Environment): Value {
        const parsed = this.parsed ? this.parsed : this.parsed = this.parseExpression(env);
        const stack: Value[] = [];
        for (let i = 0; i < parsed.length; ++i) {
            if (parsed[i] instanceof Value) {
                stack.push(parsed[i]);
            } else {
                const op: Op = parsed[i]; 
                if (!op.calc) RuntimeError.throwInvalidExpression(this);
                let args: Value[] = [];

                const caster = casters.get(op.type);
                for (let j = 0; j < op.argsCount; ++j) {
                    const arg = caster ? caster(env, stack.pop()) : stack.pop();
                    
                    if (arg === undefined) RuntimeError.throwInvalidExpression(env.curBlock, "Invalid value");
                    else args = [arg, ...args];
                };
                const calcResult = op.calc(...args);
                stack.push(calcResult instanceof Value ? 
                    calcResult : new Value(op.type, calcResult));
            }
        }
        
        return stack[0] ?? Value.Undefined; 
    }
}
