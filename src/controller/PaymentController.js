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
class PaymentController {
    pay(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { demandId } = req.params;
                if (!demandId) {
                    return res.status(400).json((0, CreateResponse_1.CreateResponse)(400, false, "invalid_parameters", "Parâmetros obrigatórios faltando", null));
                }
                const GetDemand = yield prisma.demand.findUnique({
                    where: { id: demandId }
                });
                if (!GetDemand) {
                    return res.status(400).json((0, CreateResponse_1.CreateResponse)(400, false, "payments_status_invalid", "Status de pagamentos invalido", null));
                }
                yield prisma.demand.update({ data: { status: "paid" }, where: { id: demandId } });
                return res.status(200).json((0, CreateResponse_1.CreateResponse)(200, true, "paid", "Pagamento bem sucedido!", null));
            }
            catch (err) {
                return res
                    .status(500)
                    .json((0, CreateResponse_1.CreateResponse)(500, false, "user_exist", "User exist! try with your email.", ""));
            }
        });
    }
}
exports.default = new PaymentController;
