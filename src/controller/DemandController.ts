import { json, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { CreateResponse } from "../utils/CreateResponse";
import ProposalInterface from "../interfaces/ProposalInterface";
import { UserData, getUserData, getDataFromUser } from "../../Blockchain/Connections/plan";
const prisma = new PrismaClient();

class DemandController {

    async createDemand(req:Request, res:Response): Promise<any>{
        try {
            const { id } = req.params;
            const { title, value, description, token_address, link_inspiration } = req.body;

            const {userData, planData} = await getDataFromUser("0x4fb9d3df9348d"); // coloque um address que faça sentido

            if (!userData || !planData) {
                return res.status(400).json(
                    CreateResponse(400, false, "user_not_found", "Usuário não encontrado", null)
                );
            }

            if (BigInt(planData.projects.toString()) > BigInt(0)) { // buscar do banco de dados e colocar os parâmetros corretos
                return res.status(401).json(
                    CreateResponse(401, false, "proposal_limit_reached", "Limite de propostas atingido", null)
                );
            }
            
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

    async createProposal(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { developerId, developerEmail, proposalValue, timeEstimated, negotiation } = req.body;

            const {userData, planData} = await getDataFromUser("0x4fb9d3df9348d"); // coloque um address que faça sentido

            if (!userData || !planData) {
                return res.status(400).json(
                    CreateResponse(400, false, "user_not_found", "Usuário não encontrado", null)
                );
            }

            if (BigInt(planData.projects.toString()) > BigInt(0)) { // buscar do banco de dados e colocar os parâmetros corretos
                return res.status(401).json(
                    CreateResponse(401, false, "proposal_limit_reached", "Limite de propostas atingido", null)
                );
            }
    
            // Validação dos campos
            if (!id || !developerId || !developerEmail || !proposalValue || !timeEstimated) {
                return res.status(400).json(
                    CreateResponse(400, false, "invalid_parameters", "Parâmetros obrigatórios faltando", null)
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
    
            return res.status(201).json(
                CreateResponse(201, true, "proposal_created", "Proposta criada com sucesso", newProposal.demandId)
            );
        } catch (err) {
            console.error(err);
            return res.status(500).json(
                CreateResponse(500, false, "server_error", "Erro interno no servidor", null)
            );
        }
    }
    
} 

// id String @id @default(uuid())
// title String
// description String
// value BigInt
// token String
// status String @default("pending")
// contractor_id String
// proposal Json[]
// developer_accepect String
// createdAt DateTime @default(now())
// updateAt DateTime @updatedAt

export default new DemandController;