import { Request, Response } from "express";
import { CreateResponse } from "../utils/CreateResponse";
import { GetPlan, GetDataPlan } from "../blockchain/provider/Plan";

class PlanController {

    async getPlan(req:Request, res:Response): Promise<any> {
        try {

            const { wallet } = req.params;

            if( !wallet ){

                return res.status(401).json(CreateResponse(401, false, "wallet_param_not_exist", "User's wallet not found on headers param!", "No Data"));
            }

            const Plan = await GetPlan( wallet );

            return res.status(200).json(CreateResponse( 200, true, "plan_to_wallet", "This wallet have a plan!", String( Plan) ));

        }catch(err){
            console.error(err);
        }
    }


    async getPlanData(req:Request, res:Response ): Promise<any> {
        try {

            const { wallet } = req.params;

            if( !wallet ) 
            return res.status(401).json(
            CreateResponse(
                401, 
                false, 
                "wallet_not_found", 
                "Provide your wallet to be check your plan.", 
                "No Data"
            ));

            const PlanId = await GetPlan( wallet );

            const PlanData: any = await GetDataPlan( PlanId );

            if( !PlanData ){

                return res.status(401).json(CreateResponse(401, false, "plan_error", "Error to get data plan", "No Data"));

            }

            return res.status(200).json({
                PlanData
            });

        }catch(err){
            
            console.error(err);

        }
    }
}

export default new PlanController;