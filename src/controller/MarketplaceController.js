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
class MarketplaceController {
    createItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Acesse os parâmetros do corpo da requisição
                const { title, description, value, token, category, tags } = req.body;
                // Verifique se todos os parâmetros necessários estão presentes
                if (!title || !description || !value || !token || !category || !tags) {
                    return res
                        .status(400) // Use 400 para Bad Request
                        .json((0, CreateResponse_1.CreateResponse)(400, false, "marketplace_item_invalid", "Coloque os parâmetros corretos para criar um item!", ""));
                }
                // Verifique o comprimento dos campos
                if (title.length > 100 || description.length > 350) {
                    return res
                        .status(400)
                        .json((0, CreateResponse_1.CreateResponse)(400, false, "invalid_length", "Título ou descrição muito longos.", ""));
                }
                let MetaTags;
                if (typeof tags === 'string') {
                    MetaTags = tags.split("https://").filter(Boolean);
                }
                else {
                    return res
                        .status(400)
                        .json((0, CreateResponse_1.CreateResponse)(400, false, "invalid_tags", "Tags devem ser uma string.", ""));
                }
                yield prisma.marketplace.create({
                    data: {
                        title: title,
                        description: description,
                        value: value,
                        token: token,
                        category: category,
                        status: "PUBLISHED",
                        tags: MetaTags
                    }
                });
                return res
                    .status(201)
                    .json((0, CreateResponse_1.CreateResponse)(201, true, "item_created", "Item publicado com sucesso!", null));
            }
            catch (err) {
                console.log(err);
                return res
                    .status(500)
                    .json((0, CreateResponse_1.CreateResponse)(500, false, "server_error", "Erro interno do servidor.", err));
            }
        });
    }
}
exports.default = new MarketplaceController();
