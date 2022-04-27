import * as Bch from "./Butch.js"
import { verifyVariableName } from "./utils.js"
import { CompilationError } from "./errors.js"
import ButchObj from "./ButchObj.js"
import { Block } from "./base.js"

export const syntaxCheck: Bch.Middleware = 
    function(info: Bch.BlockInfo, app: Bch.ButchBuilder) {
        if (info.obj.get("name") && !verifyVariableName(info.obj.get("name")) || 
            info.obj.get("nameSeq") && !info.obj.get("nameSeq").every(verifyVariableName)) 
        {
            CompilationError.throwSyntax(info);  
        }
}
/**
 * builds "content" of object and puts result into .extention.builtContent 
 */
export const prebuildInternalBlocks: Bch.Middleware = 
    function(info: Bch.BlockInfo, app: Bch.ButchBuilder) {
        const content = info.obj.content();
        if (content && content.length > 0) {
            const newContent: Block[] = new Array<Block>(content.length);
            for (let i = 0; i < content.length; ++i) {
                newContent[i] = app.buildBlock(
                    {obj: new ButchObj(content[i], info.obj.codes), location: info.location.concat(i)});
            }
            info.obj.extention.builtContent = newContent;
        } 
    }