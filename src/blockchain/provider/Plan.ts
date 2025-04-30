import { ethers  } from "ethers";
import PlanABI from "../../abi/Plan.json";


async function GetProvider() {
    try {

        const Provider  = await new ethers.JsonRpcProvider(`${process.env.POLYGON_URI}`);

        if( !Provider ){

            throw new Error("Provider not exist");

        }

        return Provider;

    }
    catch(err){

        console.error(err);

    }

}

async function GetContract() {
    try{
        const Provider = await GetProvider();
        
        const WalletProvider = await new ethers.Wallet( `${process.env.PRIVATE_KEY_PLAN}`, Provider );

        if( !WalletProvider ){

            throw new Error("Wallet cannot be instanced");
        }

        const Contract = await new ethers.Contract( `${process.env.PLAN_ADDRESS}`, PlanABI as ethers.InterfaceAbi, WalletProvider );

        if( !Contract ){
            
            throw new Error("Contract cannot connect");
        }

        return Contract;

    }catch(err){
        
        console.error(err);

    }

}

export async function GetPlan(User: string) {
    try {

        const Contract: ethers.Contract | any = await GetContract();

        const PlanId = await Contract.getPlan(User);

        return PlanId;

    }catch(err){

        console.error(err);

    }
}

export async function GetDataPlan( Plan: number) {
    try {

        const Contract :ethers.Contract | any = await GetContract();

        const PlanData = await Contract.getSubscriptionData( Number( Plan ) );

        if( !PlanData ){

            return false;

        }

        return {
            price: PlanData[0].toString(),
            percentage_gains: PlanData[1].toString(),
            percentage_transactions: PlanData[2].toString(),
            contacts: PlanData[3].toString(),
            projects: PlanData[4].toString()
        }

    }catch(err){
        
        console.error(err);

    }
}