import { Request, Response } from "express";

class DeveloperController {

    async Message(req: Request, res: Response): Promise<any>{

        return res.send("runing...");
    }

}


export default new DeveloperController;