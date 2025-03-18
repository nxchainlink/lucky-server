interface Result {
    http_code: number;
    success: boolean;
    info: any;
}
export function CreateResponse(Code:number, Success:boolean, Response:string, Message:string, Data:any){
    let Result:Result = {
        http_code: Code,
        success: Success,
        info: {
            response: Response,
            message: Message,

        }
    }

    if(Success){
        Result.info.data = Data;
    }
    
    return Result;
}