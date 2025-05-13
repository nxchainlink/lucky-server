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
class DeveloperController {
    setDeveloper(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, value_hour, experience, skill, graduation, description, title, portfolio, wallet, linkedin, profile_image } = req.body;
                if (!email || !wallet || !name) {
                    console.log(email, wallet, name);
                    return res
                        .status(200)
                        .json((0, CreateResponse_1.CreateResponse)(401, false, "credentials_invalid", "Your credentials is invalid, try again or come back late!", ""));
                }
                const DeveloperExist = yield prisma
                    .developerProfile
                    .findUnique({ where: { email: email } });
                const ContractorExist = yield prisma
                    .contractorProfile
                    .findUnique({ where: { email: email } });
                if (DeveloperExist || ContractorExist) {
                    return res.status(401).json((0, CreateResponse_1.CreateResponse)(401, false, "already_exist", "Your email already been created!", ""));
                }
                yield prisma.developerProfile.create({
                    data: {
                        name: name,
                        email: email,
                        value_hour: value_hour,
                        experience: experience,
                        skill: skill,
                        graduation: graduation,
                        description: description,
                        title: title,
                        portfolio: portfolio,
                        wallet: wallet,
                        profile_image: profile_image,
                        linkedin: linkedin,
                    }
                });
                return res
                    .status(200)
                    .json((0, CreateResponse_1.CreateResponse)(200, true, "profile_complete", "Your profile has been complete", { name: name, email: email, wallet: wallet }));
            }
            catch (err) {
                console.log(err);
                return res
                    .status(500)
                    .json((0, CreateResponse_1.CreateResponse)(500, false, "user_exist", "User exist! try with your email.", ""));
            }
        });
    }
    editDeveloper(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, value_hour, experience, skill, position, graduation, description, title, portfolio, wallet, linkedin, profile_image } = req.body;
                const existingProfile = yield prisma.developerProfile.findUnique({
                    where: { id }
                });
                if (!existingProfile) {
                    return res.status(401).json((0, CreateResponse_1.CreateResponse)(401, false, "user_not_exist", "User not found, try again!", ""));
                }
                if (skill || position) {
                    for (let i = 0; i < existingProfile.skill.length; i++) {
                        if (i === position) {
                            existingProfile.skill[i] = skill;
                        }
                    }
                }
                const updateData = {
                    name: name !== null && name !== void 0 ? name : existingProfile.name,
                    value_hour: value_hour !== null && value_hour !== void 0 ? value_hour : existingProfile.value_hour,
                    experience: experience !== null && experience !== void 0 ? experience : existingProfile.experience,
                    skill: existingProfile.skill,
                    graduation: graduation !== null && graduation !== void 0 ? graduation : existingProfile.graduation,
                    description: description !== null && description !== void 0 ? description : existingProfile.description,
                    title: title !== null && title !== void 0 ? title : existingProfile.title,
                    portfolio: portfolio !== null && portfolio !== void 0 ? portfolio : existingProfile.portfolio,
                    wallet: wallet !== null && wallet !== void 0 ? wallet : existingProfile.wallet,
                    linkedin: linkedin !== null && linkedin !== void 0 ? linkedin : existingProfile.linkedin,
                    profile_image: profile_image !== null && profile_image !== void 0 ? profile_image : existingProfile.profile_image
                };
                yield prisma.developerProfile.update({
                    where: { id },
                    data: updateData,
                });
                return res.status(200).json((0, CreateResponse_1.CreateResponse)(200, true, "edited_with_success", "Your profile has been edited", ""));
            }
            catch (err) {
                console.error("Error in editInfo:", err);
                return res.status(500).json((0, CreateResponse_1.CreateResponse)(500, false, "internal_server", "Error in server, send message to Lucky Level Team! 🚨", ""));
            }
        });
    }
    getDevelopers(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const GetAllDevelopersOnDatabase = yield prisma.developerProfile.findMany();
                if (!GetAllDevelopersOnDatabase) {
                    return res.status(401).json((0, CreateResponse_1.CreateResponse)(401, false, "not_exist_developers", "There are no developers yet", ""));
                }
                return res.status(200).json((0, CreateResponse_1.CreateResponse)(200, true, "view_all_developers", "View all developers in this function", GetAllDevelopersOnDatabase));
            }
            catch (err) {
                return res.status(500).json((0, CreateResponse_1.CreateResponse)(500, false, "internal_server", "Error in server, send message to Lucky Level Team! 🚨", ""));
            }
        });
    }
    getUniqueDeveloper(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, email } = req.query;
                const DeveloperId = id
                    ? yield prisma.developerProfile.findUnique({ where: { id } })
                    : null;
                const DeveloperEmail = email
                    ? yield prisma.developerProfile.findUnique({ where: { email } })
                    : null;
                if (!DeveloperId && !DeveloperEmail) {
                    return res.status(401).json((0, CreateResponse_1.CreateResponse)(401, false, "not_exist_developer", "This developer does not exist yet", ""));
                }
                return res.status(200).json((0, CreateResponse_1.CreateResponse)(200, true, "developer_find", "Here is the developer", DeveloperEmail || DeveloperId));
            }
            catch (err) {
                console.log(err);
                return res.status(500).json((0, CreateResponse_1.CreateResponse)(500, false, "internal_server", "Error in server, send message to Lucky Level Team! 🚨", ""));
            }
        });
    }
}
exports.default = new DeveloperController;
