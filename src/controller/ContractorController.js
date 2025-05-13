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
const CreateResponse_1 = require("../utils/CreateResponse");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ContractorController {
    setContractor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, country, age, company, link, wallet } = req.body;
                if (!name || !email) {
                    return res.status(401).json((0, CreateResponse_1.CreateResponse)(401, false, "credentials_invalid", "Your email or name is invalid, try again!", ""));
                }
                const ContractorExist = yield prisma.contractorProfile.findUnique({ where: { email: email } });
                const ProfessionalExist = yield prisma.developerProfile.findUnique({ where: { email: email } });
                if (ContractorExist || ProfessionalExist) {
                    return res.status(401).json((0, CreateResponse_1.CreateResponse)(401, false, "already_exist", "Your email already been created!", ""));
                }
                yield prisma.contractorProfile.create({
                    data: {
                        name: name,
                        email: email,
                        country: country,
                        age: age,
                        company: company,
                        link: link,
                        wallet: wallet
                    }
                });
                return res.status(200).json((0, CreateResponse_1.CreateResponse)(200, true, "create_successfully", "Your user has been created successfully", email));
            }
            catch (err) {
                console.log(err);
                return res.status(500).json((0, CreateResponse_1.CreateResponse)(500, false, "internal_server", "Error in server, send message to Lucky Level Team! 🚨", ""));
            }
        });
    }
    editContractor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { country, age, company, link } = req.body;
                const ContractorProfile = yield prisma
                    .contractorProfile
                    .findUnique({ where: { id: id } });
                if (!ContractorProfile) {
                    return res.status(401).json((0, CreateResponse_1.CreateResponse)(401, false, "credentials_invalid", "Your ID is not avaiable, try again!", ""));
                }
                const UpdateParams = {
                    country: country !== null && country !== void 0 ? country : ContractorProfile.country,
                    age: age !== null && age !== void 0 ? age : ContractorProfile.age,
                    company: company !== null && company !== void 0 ? company : ContractorProfile.company,
                    link: link !== null && link !== void 0 ? link : ContractorProfile.link
                };
                yield prisma
                    .contractorProfile
                    .update({
                    where: { id: id },
                    data: UpdateParams
                });
                return res.status(200).json((0, CreateResponse_1.CreateResponse)(200, true, "update_successfully", "Your user has been updated successfully", "No data!"));
            }
            catch (err) {
                console.log(err);
                return res.status(500).json((0, CreateResponse_1.CreateResponse)(500, false, "internal_server", "Error in server, send message to Lucky Level Team! 🚨", ""));
            }
        });
    }
    getContractors(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const GetAllContractors = yield prisma
                    .contractorProfile
                    .findMany();
                if (!GetAllContractors) {
                    return res.status(401).json((0, CreateResponse_1.CreateResponse)(401, false, "contractors_undefined", "Not exist contractors yet! try again.", ""));
                }
                return res.status(200).json((0, CreateResponse_1.CreateResponse)(200, true, "contractors_all", "Here is all contractors!", GetAllContractors));
            }
            catch (err) {
                return res.status(500).json((0, CreateResponse_1.CreateResponse)(500, false, "internal_server", "Error in server, send message to Lucky Level Team! 🚨", ""));
            }
        });
    }
    getContractor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, email } = req.query;
                const ContractorId = id
                    ? yield prisma.contractorProfile.findUnique({ where: { id } })
                    : null;
                const ContractorEmail = email
                    ? yield prisma.contractorProfile.findUnique({ where: { email } })
                    : null;
                if (!ContractorId && !ContractorEmail) {
                    return res.status(401).json((0, CreateResponse_1.CreateResponse)(401, false, "contractor_undefined", "Contractor not found! try again.", ""));
                }
                return res.status(200).json((0, CreateResponse_1.CreateResponse)(200, true, "contractor_find", "Here is the Contractor!", ContractorId || ContractorEmail));
            }
            catch (err) {
                console.log(err);
                return res.status(500).json((0, CreateResponse_1.CreateResponse)(500, false, "internal_server", "Error in server, send message to Lucky Level Team! 🚨", ""));
            }
        });
    }
}
///get id
///get all
// model ContractorProfile {
//     id String @id @default(uuid())
//     name String
//     email String @unique
//     country String
//     age Int
//     company String
//     link String
//     closed_contracts Int
//   }
exports.default = new ContractorController;
