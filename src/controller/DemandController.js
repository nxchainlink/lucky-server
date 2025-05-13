"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const CreateResponse_1 = require("../utils/CreateResponse");
const Plan_1 = require("../blockchain/provider/Plan");
const prisma = new client_1.PrismaClient();
class DemandController {
    createDemand(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { title, value, description, token_address, link_inspiration } = req.body;
                if (!title || value <= 0 || !description || !token_address || !link_inspiration) {
                    return res.status(401).json((0, CreateResponse_1.CreateResponse)(401, false, "parameters_invalid", "Your parameters is invalid! try again.", ""));
                }
                yield prisma.demand.create({
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
                    .json((0, CreateResponse_1.CreateResponse)(200, true, "demand_created", "Your demand has been created successfully", title));
            }
            catch (err) {
                console.log(err);
                return res
                    .status(500)
                    .json((0, CreateResponse_1.CreateResponse)(500, false, "internal_server", "Error in server, send message to Lucky Level Team! 🚨", ""));
            }
        });
    }
    deleteDemand(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(401).json((0, CreateResponse_1.CreateResponse)(401, false, "parameters_invalid", "Your parameters is invalid! try again.", ""));
                }
                const DemandData = yield prisma.demand.findUnique({
                    where: { id: id }
                });
                const ProposalData = yield prisma.proposal.findMany({
                    where: { demandId: DemandData === null || DemandData === void 0 ? void 0 : DemandData.id }
                });
                for (let i = 0; i < ProposalData.length; i++) {
                    const Dev = yield prisma.developerProfile.findUnique({ where: { id: ProposalData[i].developerId } });
                    if (Dev) {
                        yield prisma.developerProfile.update({
                            data: { service_increment: Dev.service_increment - 1 },
                            where: { id: ProposalData[i].developerId }
                        });
                    }
                }
                yield prisma.proposal.deleteMany({
                    where: { demandId: id }
                });
                yield prisma.demand.delete({
                    where: { id: id }
                });
                return res.
                    status(200)
                    .json((0, CreateResponse_1.CreateResponse)(200, true, "demand_deleted", "Your demand has been deleted successfully", null));
            }
            catch (err) {
                console.error(err);
                return res
                    .status(500)
                    .json((0, CreateResponse_1.CreateResponse)(500, false, "internal_server", "Error in server, send message to Lucky Level Team! 🚨", err));
            }
        });
    }
    createProposal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { developerId, developerEmail, proposalValue, timeEstimated, negotiation } = req.body;
                // Validação dos campos
                if (!id || !developerId || !developerEmail || !proposalValue || !timeEstimated) {
                    return res.status(400).json((0, CreateResponse_1.CreateResponse)(400, false, "invalid_parameters", "Parâmetros obrigatórios faltando", null));
                }
                const DeveloperAccount = yield prisma.developerProfile.findUnique({ where: { id: developerId } });
                if (!DeveloperAccount) {
                    return res.status(404).json((0, CreateResponse_1.CreateResponse)(404, false, "developer_not_found", "Desenvolvedor não encontrado!", null));
                }
                // Verifica se a demanda realmente existe no banco
                const demandExists = yield prisma.demand.findUnique({
                    where: { id: id },
                });
                if (!demandExists) {
                    return res.status(404).json((0, CreateResponse_1.CreateResponse)(404, false, "demand_not_found", "Demanda não encontrada", null));
                }
                const ProposalList = yield prisma.proposal.findMany({
                    where: { demandId: demandExists.id, developerId: DeveloperAccount.id }
                });
                const Proposal = yield ProposalList.find(index => index.developerId === DeveloperAccount.id);
                if (Proposal) {
                    return res.status(404).json((0, CreateResponse_1.CreateResponse)(404, false, "proposal_exist", "Você já tem uma propósta", null));
                }
                const PlanID = yield (0, Plan_1.GetPlan)(DeveloperAccount.wallet);
                const PlanData = yield (0, Plan_1.GetDataPlan)(PlanID);
                if (DeveloperAccount.service_increment >= PlanData.contacts) {
                    return res.status(404).json((0, CreateResponse_1.CreateResponse)(404, false, "target_limit", "Você já executou o maximo de propóstas permitida pelo seu plano. Faça um upgrade!", null));
                }
                // Criação da proposta
                const newProposal = yield prisma.proposal.create({
                    data: {
                        demandId: id, // Agora garantimos que demandId existe
                        developerId,
                        developerEmail,
                        proposalValue: String(proposalValue).toString(), // Mantém como string
                        timeEstimated,
                        negotiation: negotiation || "open",
                        status: "pending"
                    },
                    include: {
                        demand: true, // Inclui os dados da demanda relacionada
                    }
                });
                yield prisma.developerProfile.update({ data: { service_increment: DeveloperAccount.service_increment + 1 }, where: { id: DeveloperAccount.id } });
                return res.status(201).json((0, CreateResponse_1.CreateResponse)(201, true, "proposal_created", "Proposta criada com sucesso", newProposal.demandId));
            }
            catch (err) {
                console.error(err);
                return res.status(500).json((0, CreateResponse_1.CreateResponse)(500, false, "server_error", "Erro interno no servidor", null));
            }
        });
    }
    acceptProposal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { demandId, proposalId } = req.params;
                const { address } = req.body;
                console.log(address);
                if (!demandId || !proposalId || !address) {
                    return res.status(400).json((0, CreateResponse_1.CreateResponse)(400, false, "invalid_parameters", "Parâmetros obrigatórios faltando", null));
                }
                const GetDemand = yield prisma.demand.findUnique({
                    where: { id: demandId }
                });
                const GetAllDemand = yield prisma.proposal.findMany({
                    where: { demandId: demandId }
                });
                const DemandAlreadyAccept = GetAllDemand.find(index => index.status === "match");
                if (DemandAlreadyAccept) {
                    return res.status(400).json((0, CreateResponse_1.CreateResponse)(400, false, "demand_already_accept", "Esta demanda já foi aceita.", null));
                }
                if (!GetDemand) {
                    return res.status(400).json((0, CreateResponse_1.CreateResponse)(400, false, "demand_not_exist", "Esta demanda não existe", null));
                }
                const GetProposal = yield prisma.proposal.findUnique({
                    where: { id: proposalId }
                });
                if (!GetProposal) {
                    return res.status(400).json((0, CreateResponse_1.CreateResponse)(400, false, "proposal_not_exist", "Esta proposta não existe", null));
                }
                yield prisma.demand.update({
                    data: { status: "waitpayment", contract_hash: `${address}` },
                    where: { id: demandId }
                });
                yield prisma.proposal.update({
                    data: { status: "match" },
                    where: { id: proposalId }
                });
                return res.status(201).json((0, CreateResponse_1.CreateResponse)(201, true, "proposal_match", "Sua proposta foi aceita. Mão na massa!", null));
            }
            catch (err) {
                console.log(err);
                return err;
            }
        });
    }
    renewProposal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { developerId } = req.params;
                const TIMEOUT = 30 * 24 * 60 * 60 * 1000;
                if (!developerId) {
                    return res.status(400).json((0, CreateResponse_1.CreateResponse)(400, false, "invalid_parameters", "Parâmetros obrigatórios faltando", null));
                }
                const DevProposals = yield prisma.proposal.findMany({
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
                    const Dev = yield prisma.developerProfile.findUnique({ where: { id: developerId } });
                    yield prisma.developerProfile.update({
                        data: { service_increment: Number(Dev === null || Dev === void 0 ? void 0 : Dev.service_increment) - proposalsToDecrease },
                        where: { id: developerId }
                    });
                }
                return res.status(201).json((0, CreateResponse_1.CreateResponse)(201, true, "proposal_match", "Sua proposta foi aceita. Mão na massa!", null));
            }
            catch (err) {
                console.error(err);
                return res.status(500).json((0, CreateResponse_1.CreateResponse)(500, false, "internal_server_error", "Erro interno do servidor", null));
            }
        });
    }
    getAllDemand(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const GetAllDemands = yield prisma.demand.findMany();
                if (!GetAllDemands || GetAllDemands.length === 0) {
                    return res.status(500).json((0, CreateResponse_1.CreateResponse)(500, false, "not_demand_exist", "Nenhuma demanda existe no momento", null));
                }
                // Converter BigInt para String
                const demandsWithStringBigInt = GetAllDemands.map(demand => {
                    return Object.assign(Object.assign({}, demand), { value: demand.value.toString(), createdAt: demand.createdAt.toISOString(), updateAt: demand.updateAt.toISOString() // Certifique-se de que as datas estão em formato ISO
                     });
                });
                return res.status(200).json((0, CreateResponse_1.CreateResponse)(201, true, "list_demand", "Todas as demandas disponíveis estão aqui!", { demands: demandsWithStringBigInt }));
            }
            catch (err) {
                console.log(err);
                return res.status(500).json((0, CreateResponse_1.CreateResponse)(500, false, "internal_server_error", "Erro interno do servidor", null));
            }
        });
    }
    getStudioDemand(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const GetAllDemands = yield prisma.demand.findMany({ where: { contractor_id: String(id) } });
                if (!GetAllDemands || GetAllDemands.length === 0) {
                    return res.status(500).json((0, CreateResponse_1.CreateResponse)(500, false, "not_demand_exist", "Nenhuma demanda existe no momento", null));
                }
                // Converter BigInt para String
                const demandsWithStringBigInt = GetAllDemands.map(demand => {
                    return Object.assign(Object.assign({}, demand), { value: demand.value.toString(), createdAt: demand.createdAt.toISOString(), updateAt: demand.updateAt.toISOString() // Certifique-se de que as datas estão em formato ISO
                     });
                });
                return res.status(200).json((0, CreateResponse_1.CreateResponse)(201, true, "list_demand", "Todas as demandas disponíveis estão aqui!", { demands: demandsWithStringBigInt }));
            }
            catch (err) {
                console.log(err);
                return res.status(500).json((0, CreateResponse_1.CreateResponse)(500, false, "internal_server_error", "Erro interno do servidor", null));
            }
        });
    }
    getDemandAccepct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const getDmeand = yield prisma.demand.findUnique({ where: { id: id } });
                const getProposal = yield prisma.proposal.findMany({ where: { demandId: id, status: "accepct" } });
                if (!getProposal || !getDmeand) {
                    return res.status(500).json((0, CreateResponse_1.CreateResponse)(500, false, "not_match", "Nenhuma demanda existe no momento", null));
                }
                const demandMatch = {
                    demand: getDmeand,
                    proposal: getProposal
                };
                return res.status(200).json((0, CreateResponse_1.CreateResponse)(201, true, "list_demand", "Todas as demandas disponíveis estão aqui!", demandMatch));
            }
            catch (err) {
                console.log(err);
                return res.status(500).json((0, CreateResponse_1.CreateResponse)(500, false, "internal_server_error", "Erro interno do servidor", null));
            }
        });
    }
    editDemand(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; // ID da demanda a ser editada
                const { title, value, description, token_address, link_inspiration } = req.body;
                if (!id || !title || value <= 0 || !description || !token_address || !link_inspiration) {
                    return res.status(400).json((0, CreateResponse_1.CreateResponse)(400, false, "parameters_invalid", "Parâmetros inválidos para atualização.", ""));
                }
                const existing = yield prisma.demand.findUnique({
                    where: { id },
                });
                if (!existing) {
                    return res.status(404).json((0, CreateResponse_1.CreateResponse)(404, false, "demand_not_found", "Demanda não encontrada.", ""));
                }
                yield prisma.demand.update({
                    where: { id },
                    data: {
                        title,
                        description,
                        value,
                        token: token_address,
                        link_proposal: link_inspiration,
                    },
                });
                return res.status(200).json((0, CreateResponse_1.CreateResponse)(200, true, "demand_updated", "Demanda atualizada com sucesso!", title));
            }
            catch (err) {
                console.error(err);
                return res.status(500).json((0, CreateResponse_1.CreateResponse)(500, false, "internal_server", "Erro no servidor ao editar a demanda.", ""));
            }
        });
    }
    viewProposal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params; // id da proposta
                if (!id) {
                    return res.status(400).json((0, CreateResponse_1.CreateResponse)(400, false, "invalid_parameters", "Missing proposal ID", null));
                }
                const proposal = yield prisma.proposal.findMany({
                    where: { demandId: id },
                });
                if (!proposal) {
                    return res.status(404).json((0, CreateResponse_1.CreateResponse)(404, false, "proposal_not_found", "Proposal not found", null));
                }
                return res.status(200).json((0, CreateResponse_1.CreateResponse)(200, true, "proposal_found", "Proposal retrieved successfully", proposal));
            }
            catch (err) {
                console.error(err);
                return res.status(500).json((0, CreateResponse_1.CreateResponse)(500, false, "server_error", "Internal server error", null));
            }
        });
    }
    getUniqueDemand(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                if (!id) {
                    return res.status(400).json((0, CreateResponse_1.CreateResponse)(400, false, "missing_id", "O ID da demanda é obrigatório", null));
                }
                const demand = yield prisma.demand.findUnique({
                    where: {
                        id: String(id)
                    }
                });
                if (!demand) {
                    return res.status(404).json((0, CreateResponse_1.CreateResponse)(404, false, "demand_not_found", "Demanda não encontrada", null));
                }
                const demandFormatted = Object.assign(Object.assign({}, demand), { value: demand.value.toString(), createdAt: demand.createdAt.toISOString(), updateAt: demand.updateAt.toISOString() });
                return res.status(200).json((0, CreateResponse_1.CreateResponse)(200, true, "unique_demand", "Demanda encontrada com sucesso", { demand: demandFormatted }));
            }
            catch (err) {
                console.error(err);
                return res.status(500).json((0, CreateResponse_1.CreateResponse)(500, false, "internal_server_error", "Erro interno do servidor", null));
            }
        });
    }
}
exports.default = new DemandController;
