import e from "express";
import DeveloperController from "./controller/DeveloperController";
import ContractorController from "./controller/ContractorController";
import DemandController from "./controller/DemandController";

const route = e.Router();

/// ------------------------ DEVELOPER ------------------------------------///
route.post('/setprofile/developer=create', DeveloperController.setDeveloper);
route.put('/setprofile/developer=edit/:id', DeveloperController.editDeveloper);
route.get('/setprofile/developer=view', DeveloperController.getDevelopers);
route.get('/setprofile/developer=view/:id', DeveloperController.getUniqueDeveloper);

/// ------------------------ CONTRACTOR ------------------------------------///
route.post('/setprofile/contractor=create', ContractorController.setContractor);
route.put('/setprofile/contractor=edit/:id', ContractorController.editContractor);
route.get('/setprofile/contractor=view', ContractorController.getContractors);
route.get('/setprofile/contractor=view/:id', ContractorController.getContractor)

/// ------------------------ CONTRACTOR ------------------------------------///
route.post('/demand=create/:id', DemandController.createDemand);
route.post('/demand/proposal=create/:id', DemandController.createProposal);

export default route;