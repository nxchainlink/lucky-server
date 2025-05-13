"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DeveloperController_1 = __importDefault(require("./controller/DeveloperController"));
const ContractorController_1 = __importDefault(require("./controller/ContractorController"));
const DemandController_1 = __importDefault(require("./controller/DemandController"));
const PlanController_1 = __importDefault(require("./controller/PlanController"));
const PaymentController_1 = __importDefault(require("./controller/PaymentController"));
const MarketplaceController_1 = __importDefault(require("./controller/MarketplaceController"));
const InitializeController_1 = __importDefault(require("./controller/InitializeController"));
const route = express_1.default.Router();
/// ------------------------ DEVELOPER ------------------------------------///
route.post('/setprofile/developer=create', DeveloperController_1.default.setDeveloper);
route.put('/setprofile/developer=edit/:id', DeveloperController_1.default.editDeveloper);
route.get('/setprofile/developer=view', DeveloperController_1.default.getDevelopers);
route.get('/setprofile/developer/unique=view', DeveloperController_1.default.getUniqueDeveloper);
/// ------------------------ CONTRACTOR ------------------------------------///
route.post('/setprofile/contractor=create', ContractorController_1.default.setContractor);
route.put('/setprofile/contractor=edit/:id', ContractorController_1.default.editContractor);
route.get('/setprofile/contractor=view', ContractorController_1.default.getContractors);
route.get('/setprofile/contractor/unique=view', ContractorController_1.default.getContractor);
/// ------------------------ DEMAND ------------------------------------///
route.post('/demand=create/:id', DemandController_1.default.createDemand);
route.post('/demand/proposal=create/:id', DemandController_1.default.createProposal);
route.delete('/demand=delete/:id', DemandController_1.default.deleteDemand);
route.put('/demand/match/:demandId/:proposalId', DemandController_1.default.acceptProposal);
route.put('/proposal/:developerId', DemandController_1.default.renewProposal);
route.put('/demand/edit/:id', DemandController_1.default.editDemand);
route.get('/demand=list', DemandController_1.default.getAllDemand);
route.get('/demand=list/studio', DemandController_1.default.getStudioDemand);
route.get('/demand/accepct/:id', DemandController_1.default.getStudioDemand);
route.get('/proposal=list/:id', DemandController_1.default.viewProposal);
route.get('/demand/unique', DemandController_1.default.getUniqueDemand);
/// ------------------------ PLAN ------------------------------------///
route.get('/plan/:wallet', PlanController_1.default.getPlan);
route.get('/plan/data/:wallet', PlanController_1.default.getPlanData);
/// ------------------------ PAYMENT ------------------------------------///
route.put('/payment=paid/:demandId', PaymentController_1.default.pay);
/// ------------------------ MARKETPLACE ------------------------------------///
route.post('/marketplace=create', MarketplaceController_1.default.createItem);
route.get('/run', InitializeController_1.default.Message);
exports.default = route;
