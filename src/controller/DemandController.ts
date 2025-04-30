import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { CreateResponse } from "../utils/CreateResponse";
import { GetDataPlan, GetPlan } from "../blockchain/provider/Plan";
import { id } from "ethers";
const prisma = new PrismaClient();

class DemandController {

    async createDemand(req:Request, res:Response): Promise<any>{
        try {
            const { id } = req.params;
            const { title, value, description, token_address, link_inspiration } = req.body;

            if(!title || value <= 0 || !description || !token_address || !link_inspiration){
                return res.status(401).json(CreateResponse(401, false, "parameters_invalid", "Your parameters is invalid! try again.", ""));
            }

            await prisma.demand.create({
                data: {
                    title: title,
                    description: description,
                    value: value,
                    token: token_address,
                    contractor_id: id,
                    developer_accepect: "pending",
                    link_proposal: link_inspiration         
                }
            });

            return res.
            status(200)
            .json(
                CreateResponse(200, true, "demand_created", "Your demand has been created successfully", title)
            );
        } 
        catch(err){
            console.log(err)
            return res
            .status(500)
            .json(
                CreateResponse(500, false, "internal_server", "Error in server, send message to Lucky Level Team! 🚨", "")
            );
        }
    }

    async deleteDemand(req:Request, res:Response) : Promise<any> {
        try {

            const { id } = req.params;

            if ( !id ){
                return res.status(401).json(CreateResponse(401, false, "parameters_invalid", "Your parameters is invalid! try again.", ""));
            }

            const DemandData = await prisma.demand.findUnique(
                {
                    where: {id: id}
                }
            );

            const ProposalData = await prisma.proposal.findMany(
                {
                    where: {demandId: DemandData?.id}
                }
            );


            for(let i=0; i < ProposalData.length; i ++) {

                const Dev = await prisma.developerProfile.findUnique({where: {id: ProposalData[i].developerId}});

                if( Dev ){

                    await prisma.developerProfile.update(
                        {
                            data: {service_increment: Dev.service_increment - 1},
                            where: {id: ProposalData[i].developerId}
                        }
                    )

                }       
                
            }

            await prisma.proposal.deleteMany({
                where: { demandId: id }
            });

            await prisma.demand.delete({
                where: { id: id }
            });

            return res.
            status(200)
            .json(
                CreateResponse(200, true, "demand_deleted", "Your demand has been deleted successfully", null)
            );

        }catch(err){
            console.error(err);
            return res
            .status(500)
            .json(
                CreateResponse(500, false, "internal_server", "Error in server, send message to Lucky Level Team! 🚨", err)
            );
        }
    }

    async createProposal(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { developerId, developerEmail, proposalValue, timeEstimated, negotiation } = req.body;
    
            // Validação dos campos
            if (!id || !developerId || !developerEmail || !proposalValue || !timeEstimated) {
                return res.status(400).json(
                    CreateResponse(400, false, "invalid_parameters", "Parâmetros obrigatórios faltando", null)
                );
            }

            const DeveloperAccount = await prisma.developerProfile.findUnique(
                {where: { id: developerId }}
            );

            if( !DeveloperAccount ){

                return res.status(404).json(
                    CreateResponse(404, false, "developer_not_found", "Desenvolvedor não encontrado!", null)
                );

            }
    
            // Verifica se a demanda realmente existe no banco
            const demandExists = await prisma.demand.findUnique({
                where: { id: id },
            });
    
            if (!demandExists) {

                return res.status(404).json(
                    CreateResponse(404, false, "demand_not_found", "Demanda não encontrada", null)
                );

            }

            const ProposalList = await prisma.proposal.findMany(
                {
                    where: {demandId: demandExists.id, developerId: DeveloperAccount.id} 
                }
            );

            const Proposal = await ProposalList.find(
                index => index.developerId === DeveloperAccount.id
            );

            if(Proposal){

                return res.status(404).json(
                    CreateResponse(404, false, "proposal_exist", "Você já tem uma propósta", null)
                );

            }
           
            
            const PlanID = await GetPlan( DeveloperAccount.wallet );

            const PlanData: any = await GetDataPlan( PlanID );

            if( DeveloperAccount.service_increment >= PlanData.contacts  ){

                return res.status(404).json(
                    CreateResponse(404, false, "target_limit", "Você já executou o maximo de propóstas permitida pelo seu plano. Faça um upgrade!", null)
                );

            }
    
            // Criação da proposta
            const newProposal = await prisma.proposal.create({
                data: {
                    demandId: id, // Agora garantimos que demandId existe
                    developerId,
                    developerEmail,
                    proposalValue: String(proposalValue).toString(), // Mantém como string
                    timeEstimated,
                    negotiation: negotiation || "open",
                },
                include: {
                    demand: true, // Inclui os dados da demanda relacionada
                }
            });


            await prisma.developerProfile.update({ data: {service_increment: DeveloperAccount.service_increment + 1}, where: { id: DeveloperAccount.id}})
    
            return res.status(201).json(

                CreateResponse(201, true, "proposal_created", "Proposta criada com sucesso", newProposal.demandId)

            );

        } 
        catch (err) {

            console.error(err);

            return res.status(500).json(

                CreateResponse(500, false, "server_error", "Erro interno no servidor", null)

            );

        }
    }

    async acceptProposal(req:Request, res:Response): Promise<any> {
        try {

            const { demandId, proposalId } = req.params;

            if( !demandId || !proposalId ){

                return res.status(400).json(
                    CreateResponse(400, false, "invalid_parameters", "Parâmetros obrigatórios faltando", null)
                ); 

            }

            const GetDemand = await prisma.demand.findUnique( 
                {
                    where: {id: demandId}
                }
            )

            const GetAllDemand = await prisma.proposal.findMany(
                {
                    where: {demandId: demandId}
                }
            )


            const DemandAlreadyAccept = GetAllDemand.find(index => index.negotiation === "match");

            if( DemandAlreadyAccept ){

                return res.status(400).json(

                    CreateResponse(400, false, "demand_already_accept", "Esta demanda já foi aceita.", null)

                ); 
            }
            
            if( !GetDemand ){

                return res.status(400).json(
                    CreateResponse(400, false, "demand_not_exist", "Esta demanda não existe", null)
                ); 

            }

            const GetProposal = await prisma.proposal.findUnique(
                {
                    where: {id: proposalId}
                }
            )

            if( !GetProposal ){

                return res.status(400).json(

                    CreateResponse(400, false, "proposal_not_exist", "Esta proposta não existe", null)

                ); 

            }

            await prisma.demand.update(
                {
                    data: {status: "waitpayment"},
                    where: {id: demandId}
                }
            )

            await prisma.proposal.update(
                {
                    data:  { negotiation: "match" },
                    where: { id: proposalId }
                }
            );

            return res.status(201).json(

                CreateResponse(201, true, "proposal_match", "Sua proposta foi aceita. Mão na massa!", null)

            );

        }catch(err){
            console.log(err);
            return err;

        }
    }

    async renewProposal(req: Request, res: Response): Promise<any> {
        try {

            const { developerId } = req.params;
            
            const TIMEOUT = 30 * 24 * 60 * 60 * 1000; 
            if (!developerId) {
                return res.status(400).json(
                    CreateResponse(400, false, "invalid_parameters", "Parâmetros obrigatórios faltando", null)
                );
            }
    
            const DevProposals = await prisma.proposal.findMany({
                where: { developerId: developerId }
            });
    
            let proposalsToDecrease = 0;
    
            for (let i = 0; i < DevProposals.length; i++) {
                const CreatedAtTimestamp = DevProposals[i].createdAt.getTime();

                if (Date.now() - CreatedAtTimestamp >= TIMEOUT) {
                    proposalsToDecrease++;
                }
            }
    
            if (proposalsToDecrease > 0) {
                const Dev = await prisma.developerProfile.findUnique({ where: { id: developerId } });
                await prisma.developerProfile.update({
                    data: { service_increment: Number(Dev?.service_increment) - proposalsToDecrease },
                    where: { id: developerId }
                });
            }
    
            return res.status(201).json(
                CreateResponse(201, true, "proposal_match", "Sua proposta foi aceita. Mão na massa!", null)
            );
        } catch (err) {
            console.error(err); 
            return res.status(500).json(
                CreateResponse(500, false, "internal_server_error", "Erro interno do servidor", null)
            );
        }
    }

    async getAllDemand(_: Request, res: Response): Promise<any> {
        try {
            const GetAllDemands = await prisma.demand.findMany();
    
            if (!GetAllDemands || GetAllDemands.length === 0) {
                return res.status(500).json(
                    CreateResponse(500, false, "not_demand_exist", "Nenhuma demanda existe no momento", null)
                );
            }
    
            // Converter BigInt para String
            const demandsWithStringBigInt = GetAllDemands.map(demand => {
                return {
                    ...demand,
                    value: demand.value.toString(), // Converta o BigInt para String
                    createdAt: demand.createdAt.toISOString(), // Certifique-se de que as datas estão em formato ISO
                    updateAt: demand.updateAt.toISOString() // Certifique-se de que as datas estão em formato ISO
                };
            });
    
            return res.status(200).json(CreateResponse(201, true, "list_demand", "Todas as demandas disponíveis estão aqui!", { demands: demandsWithStringBigInt }));
        } catch (err) {
            console.log(err);
            return res.status(500).json(
                CreateResponse(500, false, "internal_server_error", "Erro interno do servidor", null)
            );
        }
    }
    
    
} 

export default new DemandController;