import * as Bch from "./Buch"
import { verifyVariableName } from "./utils.js"
import { CompilationError } from "./errors.js"

export const syntaxCheck: Bch.Middleware = 
    function(info: Bch.BlockInfo, codes: {[key: string]: string}, app: Bch.BuchBuilder) {
        if (info.obj[codes.name] && !verifyVariableName(info.obj[codes.name]) || 
            info.obj[codes.nameSeq] && !info.obj[codes.nameSeq].every(verifyVariableName)) 
        {
            CompilationError.throwSyntax(info, codes);  
        }
}

export const prebuildInternalBlocks: Bch.Middleware = 
    function(info: Bch.BlockInfo, codes: {[key: string]: string}, app: Bch.BuchBuilder) {
        
        console.log(JSON.stringify(info))
        
        const content = info.obj[codes.content];
        if (content && content.length > 0) {
            const newContent: Bch.BuchObj[] = new Array<Bch.BuchObj>(content.length);
            for (let i = 0; i < content.length; ++i) {
                newContent[i] = app.buildBlock({obj: content[i], location: info.location.concat(i)});
            }
            info.obj.builtContent = newContent;
        } 
    }