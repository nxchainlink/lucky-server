import { Request, Response } from "express";
import { CreateResponse } from "../utils/CreateResponse";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class MarketplaceController {
    async createItem(req: Request, res: Response): Promise<any> {
        try {
            // Acesse os parâmetros do corpo da requisição
            const { title, description, value, token, category, tags } = req.body;

            // Verifique se todos os parâmetros necessários estão presentes
            if (!title || !description || !value || !token || !category || !tags) {
                return res
                    .status(400) // Use 400 para Bad Request
                    .json(CreateResponse(400, false, "marketplace_item_invalid", "Coloque os parâmetros corretos para criar um item!", ""));
            }

            // Verifique o comprimento dos campos
            if (title.length > 100 || description.length > 350) {
                return res
                    .status(400)
                    .json(CreateResponse(400, false, "invalid_length", "Título ou descrição muito longos.", ""));
            }

            let MetaTags;
            if (typeof tags === 'string') {
                MetaTags = tags.split("https://").filter(Boolean);
            } else {
                return res
                    .status(400)
                    .json(CreateResponse(400, false, "invalid_tags", "Tags devem ser uma string.", ""));
            }

            await prisma.marketplace.create(
                {
                    data: {
                        title: title,
                        description: description, 
                        value: value,
                        token: token,
                        category: category,
                        status: "PUBLISHED",
                        tags: MetaTags
                    }
                }
            );

            return res
            .status(201)
            .json(CreateResponse(201, true, "item_created", "Item publicado com sucesso!", null));

        } catch (err) {
            console.log(err);
            return res
                .status(500)
                .json(CreateResponse(500, false, "server_error", "Erro interno do servidor.", err));
        }
    }

    ///exibir items 
    /// deletar items 
    ///editar items 
}

export default new MarketplaceController();
