import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import toast from "react-hot-toast";
import { createGrantPoolContract } from "../utils/GrantPoolContract";

export interface Context {
  connectWallet: () => void;
  enterGrantPool: () => void;
  pickWinner: () => void;
  withdrawPot: () => void;
  address: string;
  grantPoolPot: string;
  grantPoolPlayers: string[];
  lastWinner: string;
  grantPoolId: number;
}

export const AppContext = createContext<Context | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string>("");
  const [grantPoolContract, setGrantPoolContract] =
    useState<Contract<any> | null>(null);
  const [grantPoolPot, setGrantPoolPot] = useState<string>("");
  const [grantPoolPlayers, setGrantPoolPlayers] = useState<string[]>([]);
  const [lastWinner, setLastWinner] = useState<string>("");
  const [grantPoolId, setGrantPoolId] = useState<number>(0);

  const connectWallet = async () => {
    if ((window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        fetchConnectedWallet();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fetchConnectedWallet = useCallback(async () => {
    if ((window as any).ethereum) {
      try {
        const web3 = new Web3((window as any).ethereum);
        const accounts = await web3.eth.getAccounts();
        setAddress(accounts[0]);

        const contract = createGrantPoolContract(web3);
        setGrantPoolContract(contract);

        (window as any).ethereum.on("accountsChanged", async () => {
          const accs = await web3.eth.getAccounts();
          setAddress(accs[0]);
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const updateGrantPool = useCallback(async () => {
    if (grantPoolContract) {
      try {
        const potInWEI = await grantPoolContract.methods.getBalance().call();
        const formattedPot = Web3.utils.fromWei(String(potInWEI), "ether");
        setGrantPoolPot(formattedPot);

        const players = await grantPoolContract.methods.getPlayers().call();
        setGrantPoolPlayers(players as string[]);

        const lotteryId = await grantPoolContract.methods.getLotteryId().call();
        setGrantPoolId(Number(lotteryId));
      } catch (error) {
        console.error(error);
      }
    }
  }, [grantPoolContract]);

  const enterGrantPool = async () => {
    if (!grantPoolContract) return;
    try {
      await grantPoolContract.methods.enter().send({
        from: address,
        value: Web3.utils.toWei("0.01", "ether"),
      });
      updateGrantPool();
    } catch (error: any) {
      toast.error("Transaction failed.");
    }
  };

  const pickWinner = async () => {
    /* Add logic similarly */
  };
  const withdrawPot = async () => {
    /* Add logic similarly */
  };

  useEffect(() => {
    updateGrantPool();
  }, [updateGrantPool]);

  return (
    <AppContext.Provider
      value={{
        connectWallet,
        enterGrantPool,
        pickWinner,
        withdrawPot,
        address,
        grantPoolPot,
        grantPoolPlayers,
        lastWinner,
        grantPoolId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext)!;
