"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateResponse = CreateResponse;
function CreateResponse(Code, Success, Response, Message, Data) {
    let Result = {
        http_code: Code,
        success: Success,
        info: {
            response: Response,
            message: Message,
        }
    };
    if (Success) {
        Result.info.data = Data;
    }
    return Result;
}
