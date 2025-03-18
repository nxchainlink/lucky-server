import { Request, Response } from "express";
import { CreateResponse } from "../utils/CreateResponse";
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

class DeveloperController {

    async setDeveloper(req:Request, res:Response):Promise<any>{
        try {
            const {
                name, 
                email, 
                value_hour, 
                experience, 
                skill, 
                graduation, 
                description, 
                title, 
                portfolio, 
                wallet, 
                linkedin, 
            } = req.body;

            if(!email || !wallet || !name){
                return res
                .status(200)
                .json(CreateResponse(401, false, "credentials_invalid", "Your credentials is invalid, try again or come back late!", ""));
            }

            const DeveloperExist = await prisma
            .developerProfile
            .findUnique(
                {where: {email: email}}
            );

            if(DeveloperExist){
                return res.status(401).json(CreateResponse(401, false, "already_exist", "Your email already been created!", ""));
            }

            await prisma.developerProfile.create({
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
                    linkedin: linkedin
                }
            });

            return res
            .status(200)
            .json(CreateResponse(200, true, "profile_complete", "Your profile has been complete", {name: name, email: email, wallet: wallet}))
        }
        catch(err){
            return res
            .status(500)
            .json(CreateResponse(500, false, "user_exist", "User exist! try with your email.", ""))
        }
    }

    async editDeveloper(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const {
                name,
                value_hour,
                experience,
                skill,
                position,
                graduation,
                description,
                title,
                portfolio,
                wallet,
                linkedin,
            } = req.body;
    
            const existingProfile = await prisma.developerProfile.findUnique({
                where: { id }
            });
    
            if (!existingProfile) {
                return res.status(401).json(CreateResponse(401, false, "user_not_exist", "User not found, try again!", ""));
            }
            
            if(skill || position){
                for(let i=0; i < existingProfile.skill.length; i++){
                    if(i === position){
                        existingProfile.skill[i] = skill;
                    }
                }
            }
            
            const updateData = {
                name: name ?? existingProfile.name,
                value_hour: value_hour ?? existingProfile.value_hour,
                experience: experience ?? existingProfile.experience,
                skill: existingProfile.skill,
                graduation: graduation ?? existingProfile.graduation,
                description: description ?? existingProfile.description,
                title: title ?? existingProfile.title,
                portfolio: portfolio ?? existingProfile.portfolio,
                wallet: wallet ?? existingProfile.wallet,
                linkedin: linkedin ?? existingProfile.linkedin,
                
            };
    
            await prisma.developerProfile.update({
                where: { id },
                data: updateData,
            });
    
            return res.status(200).json(CreateResponse(200, true, "edited_with_success", "Your profile has been edited", ""));
        } 
        catch (err) {
            console.error("Error in editInfo:", err);
            return res.status(500).json(CreateResponse(500, false, "internal_server", "Error in server, send message to Lucky Level Team! 🚨", ""));
        }
    }

    async getDevelopers(_:any, res:Response): Promise<any>{
        try {
            const GetAllDevelopersOnDatabase = await prisma.developerProfile.findMany();
            if(!GetAllDevelopersOnDatabase){
                return res.status(401).json(CreateResponse(401, false, "not_exist_developers", "There are no developers yet", ""));
            }

            return res.status(200).json(CreateResponse(200, true, "view_all_developers", "View all developers in this function", GetAllDevelopersOnDatabase));
        }
        catch(err){
            return res.status(500).json(CreateResponse(500, false, "internal_server", "Error in server, send message to Lucky Level Team! 🚨", ""))
        }
    }

    async getUniqueDeveloper(req:Request, res:Response): Promise<any>{
        try {
            const {id} = req.params;

            const Developer = await prisma.developerProfile.findUnique({where: {id: id}});

            if(!Developer){
                return res.status(401).json(CreateResponse(401, false, "not_exist_developer", "This developer does not exist yet", ""));
            }

            return res.status(200).json(CreateResponse(200, true, "developer_find", "Here is the developer", Developer));
        }
        catch(err){
            return res.status(500).json(CreateResponse(500, false, "internal_server", "Error in server, send message to Lucky Level Team! 🚨", ""))
        }
    }
}

export default new DeveloperController;