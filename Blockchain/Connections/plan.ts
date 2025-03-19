import { ethers } from "ethers";
import ABI from "./abi.json";
import { AbiType } from "./AbiType";
import provider from "./provider";

const contractAddress = "0xa62fc8249aE6DC6A571F8f05607378251B57CC7d"; 

const plan = new ethers.Contract(contractAddress, ABI, provider);

export type UserData = {
    permissions: string;
    isActivated: boolean;
    seller: string;
    expirationTimestamp: BigInt;
}

export type PlanData = {
    price: BigInt;
    percentage_gains: BigInt;
    percentage_transactions: BigInt;
    contacts: BigInt;
    projects: BigInt;
}

export async function getUserData(address: string): Promise<UserData> {
    const userData: UserData = await plan.users_data(address);
    return userData;
}

export async function getDataFromUser(address: string): Promise<{userData: UserData, planData: PlanData}> {
    
    const userData: UserData = await getUserData(address);
    let planData: PlanData;

    if(userData.permissions === '0x0001') {
        planData = await plan.getSubscriptionData(1);
    }
    else if(userData.permissions === '0x0003') {
        planData = await plan.getSubscriptionData(2);
    }
    else if(userData.permissions === '0x0007') {
        planData = await plan.enterprise_plans(address);
    }
    else {
        planData = await plan.getSubscriptionData(0);
    }

    return {userData, planData};
}

