import { Request, Response } from "express";
import { CreateResponse } from "../utils/CreateResponse";
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

class PaymentController {

    async pay(req:Request, res:Response):Promise<any>{
        try {
            const { demandId } = req.params;

            if( !demandId ){
                return res.status(400).json(
                    CreateResponse(400, false, "invalid_parameters", "Parâmetros obrigatórios faltando", null)
                );
            }

            const GetDemand = await prisma.demand.findUnique(
                {
                    where: {id: demandId}
                }
            );

            if(!GetDemand){
                return res.status(400).json(
                    CreateResponse(400, false, "payments_status_invalid", "Status de pagamentos invalido", null)
                );
            }

            await prisma.demand.update({data: { status: "paid"}, where: {id: demandId}});

            return res.status(200).json(
                CreateResponse(200, true, "paid", "Pagamento bem sucedido!", null)
            );
        }
        catch(err){
            return res
            .status(500)
            .json(CreateResponse(500, false, "user_exist", "User exist! try with your email.", ""))
        }
    }
}

export default new PaymentController;