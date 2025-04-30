import { Request, Response } from "express";
import { CreateResponse } from "../utils/CreateResponse";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
class ContractorController {

async setContractor(req:Request, res:Response): Promise<any>{
        try {
            const {name, email, country, age, company, link} = req.body;

            if(!name || !email){
                return res.status(401).json(CreateResponse(401, false, "credentials_invalid", "Your email or name is invalid, try again!", ""));
            }

            const ContractorExist = await prisma.contractorProfile.findUnique({where: {email: email}});
            const ProfessionalExist = await prisma.developerProfile.findUnique({where: {email: email}});

            if(ContractorExist || ProfessionalExist){
                return res.status(401).json(CreateResponse(401, false, "already_exist", "Your email already been created!", ""));
            }

            await prisma.contractorProfile.create({
                data: {
                    name: name,
                    email: email,
                    country: country,
                    age: age,
                    company: company,
                    link: link
                }
            })

            return res.status(200).json(CreateResponse(200, true, "create_successfully", "Your user has been created successfully", email));
        }
        catch(err){
            console.log(err);
            return res.status(500).json(CreateResponse(500, false, "internal_server", "Error in server, send message to Lucky Level Team! 🚨", ""));
        }
    }

    async editContractor(req:Request, res:Response): Promise<any>{
        try {
            const { id } = req.params;
            const { country, age, company, link } = req.body;

            const ContractorProfile = await prisma
            .contractorProfile
            .findUnique(
                {where: {id: id}}
            );

            if(!ContractorProfile){
                return res.status(401).json(CreateResponse(401, false, "credentials_invalid", "Your ID is not avaiable, try again!", ""));
            }
            const UpdateParams = {
                country: country ?? ContractorProfile.country,
                age: age ?? ContractorProfile.age,
                company: company ?? ContractorProfile.company,
                link: link ?? ContractorProfile.link
            }

            await prisma
            .contractorProfile
            .update({
                where: {id: id},
                data: UpdateParams
            });

            return res.status(200).json(CreateResponse(200, true, "update_successfully", "Your user has been updated successfully", "No data!"));
        }
        catch(err){
            return res.status(500).json(CreateResponse(500, false, "internal_server", "Error in server, send message to Lucky Level Team! 🚨", ""));
         }
    }

    async getContractors(_:any, res:Response): Promise<any>{
        try {
            const GetAllContractors = await prisma
            .contractorProfile
            .findMany();

            if(!GetAllContractors){
                return res.status(401).json(CreateResponse(401, false, "contractors_undefined", "Not exist contractors yet! try again.", ""));
            }

            return res.status(200).json(CreateResponse(200, true, "contractors_all", "Here is all contractors!", GetAllContractors));
        }
        catch(err){
            return res.status(500).json(CreateResponse(500, false, "internal_server", "Error in server, send message to Lucky Level Team! 🚨", ""));
        }
    }

    async getContractor(req:Request, res:Response): Promise<any>{
        try {
            const { id } = req.params;

            const GetContractor = await prisma
            .contractorProfile
            .findUnique({
                where: {id}
            });

            if(!GetContractor){
                return res.status(401).json(CreateResponse(401, false, "contractor_undefined", "Contractor not found! try again.", ""));
            }

            return res.status(200).json(CreateResponse(200, true, "contractor_find", "Here is the Contractor!", GetContractor));
        }
        catch(err){
            return res.status(500).json(CreateResponse(500, false, "internal_server", "Error in server, send message to Lucky Level Team! 🚨", ""));
        }
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

export default new ContractorController;