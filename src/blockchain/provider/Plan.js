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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPlan = GetPlan;
exports.GetDataPlan = GetDataPlan;
const ethers_1 = require("ethers");
const Plan_json_1 = __importDefault(require("../../abi/Plan.json"));
function GetProvider() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const Provider = yield new ethers_1.ethers.JsonRpcProvider(`${process.env.POLYGON_URI}`);
            if (!Provider) {
                throw new Error("Provider not exist");
            }
            return Provider;
        }
        catch (err) {
            console.error(err);
        }
    });
}
function GetContract() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const Provider = yield GetProvider();
            const WalletProvider = yield new ethers_1.ethers.Wallet(`${process.env.PRIVATE_KEY_PLAN}`, Provider);
            if (!WalletProvider) {
                throw new Error("Wallet cannot be instanced");
            }
            const Contract = yield new ethers_1.ethers.Contract(`${process.env.PLAN_ADDRESS}`, Plan_json_1.default, WalletProvider);
            if (!Contract) {
                throw new Error("Contract cannot connect");
            }
            return Contract;
        }
        catch (err) {
            console.error(err);
        }
    });
}
function GetPlan(User) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const Contract = yield GetContract();
            const PlanId = yield Contract.getPlan(User);
            return PlanId;
        }
        catch (err) {
            console.error(err);
        }
    });
}
function GetDataPlan(Plan) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const Contract = yield GetContract();
            const PlanData = yield Contract.getSubscriptionData(Number(Plan));
            if (!PlanData) {
                return false;
            }
            return {
                price: PlanData[0].toString(),
                percentage_gains: PlanData[1].toString(),
                percentage_transactions: PlanData[2].toString(),
                contacts: PlanData[3].toString(),
                projects: PlanData[4].toString()
            };
        }
        catch (err) {
            console.error(err);
        }
    });
}
