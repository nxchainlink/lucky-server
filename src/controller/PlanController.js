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
const Plan_1 = require("../blockchain/provider/Plan");
class PlanController {
    getPlan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { wallet } = req.params;
                if (!wallet) {
                    return res.status(401).json((0, CreateResponse_1.CreateResponse)(401, false, "wallet_param_not_exist", "User's wallet not found on headers param!", "No Data"));
                }
                const Plan = yield (0, Plan_1.GetPlan)(wallet);
                return res.status(200).json((0, CreateResponse_1.CreateResponse)(200, true, "plan_to_wallet", "This wallet have a plan!", Number(Plan) || Number(0)));
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    getPlanData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { wallet } = req.params;
                if (!wallet)
                    return res.status(401).json((0, CreateResponse_1.CreateResponse)(401, false, "wallet_not_found", "Provide your wallet to be check your plan.", "No Data"));
                const PlanId = yield (0, Plan_1.GetPlan)(wallet);
                const PlanData = yield (0, Plan_1.GetDataPlan)(PlanId);
                if (!PlanData) {
                    return res.status(401).json((0, CreateResponse_1.CreateResponse)(401, false, "plan_error", "Error to get data plan", "No Data"));
                }
                return res.status(200).json({
                    PlanData
                });
            }
            catch (err) {
                console.error(err);
            }
        });
    }
}
exports.default = new PlanController;
