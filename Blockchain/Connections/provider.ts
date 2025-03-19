import { ethers } from "ethers";

const RPC_URL = 'wss://polygon-bor-rpc.publicnode.com'; 
const provider = new ethers.JsonRpcProvider(RPC_URL);

export default provider