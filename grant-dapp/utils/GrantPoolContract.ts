import Web3 from "web3";
import GrantPoolABI from "./GrantPool.json"; // Path to your ABI file

export const createGrantPoolContract = (web3: Web3) => {
  const contractAddress = "0x2762D6b29132029Ea20D646BABAF20fBE9522CD5";
  return new web3.eth.Contract(GrantPoolABI.abi as any, contractAddress);
};
