import e from "express";
import DeveloperController from "./controller/DeveloperController";
import ContractorController from "./controller/ContractorController";
import DemandController from "./controller/DemandController";
import PlanController from "./controller/PlanController";
import PaymentController from "./controller/PaymentController";
import MarketplaceController from "./controller/MarketplaceController";

const route = e.Router();

/// ------------------------ DEVELOPER ------------------------------------///
route.post('/setprofile/developer=create', DeveloperController.setDeveloper);
route.put('/setprofile/developer=edit/:id', DeveloperController.editDeveloper);
route.get('/setprofile/developer=view', DeveloperController.getDevelopers);
route.get('/setprofile/developer/unique=view', DeveloperController.getUniqueDeveloper);



/// ------------------------ CONTRACTOR ------------------------------------///
route.post('/setprofile/contractor=create', ContractorController.setContractor);
route.put('/setprofile/contractor=edit/:id', ContractorController.editContractor);
route.get('/setprofile/contractor=view', ContractorController.getContractors);
route.get('/setprofile/contractor=view/:id', ContractorController.getContractor)

/// ------------------------ DEMAND ------------------------------------///
route.post('/demand=create/:id', DemandController.createDemand);
route.post('/demand/proposal=create/:id', DemandController.createProposal);
route.delete('/demand=delete/:id', DemandController.deleteDemand);
route.put('/demand/match/:demandId/:proposalId', DemandController.acceptProposal);
route.put('/proposal/:developerId', DemandController.renewProposal);
route.get('/demand=list', DemandController.getAllDemand);

/// ------------------------ PLAN ------------------------------------///
route.get('/plan/:wallet', PlanController.getPlan);
route.get('/plan/data/:wallet', PlanController.getPlanData);

/// ------------------------ PAYMENT ------------------------------------///
route.put('/payment=paid/:demandId', PaymentController.pay);

/// ------------------------ MARKETPLACE ------------------------------------///
route.post('/marketplace=create', MarketplaceController.createItem);

export default route;