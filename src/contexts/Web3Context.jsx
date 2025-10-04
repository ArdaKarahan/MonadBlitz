import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ethers } from "ethers";
import { CHAINLANCE_ABI } from "../contracts/chainlanceAbi";

const Web3Ctx = createContext(null);

// CONTRACT address (değiştirmiyoruz)
const CONTRACT_ADDRESS =
  import.meta.env.VITE_CHAINLANCE_ADDRESS ||
  "0x2e91a9ae7485c7e0ea802a498d0f8caef3fde85a";

// >>> SADECE ŞU RPC EKLENDİ <<<
const MONAD_RPC =
  import.meta.env.VITE_MONAD_RPC ||
  "https://monad-testnet.g.alchemy.com/v2/lcdFUQSvQhIWgiX4GZ-YV";

export function Web3Provider({ children }) {
  const [provider, setProvider] = useState(null); // MetaMask provider (yazma)
  const [readProvider, setReadProvider] = useState(null); // RPC provider (okuma)
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // connect
  const connectWallet = async () => {
    if (!window.ethereum)
      return { success: false, error: "MetaMask not found" };
    try {
      const prov = new ethers.BrowserProvider(window.ethereum);
      await prov.send("eth_requestAccounts", []);
      const s = await prov.getSigner();
      const addr = await s.getAddress();
      const ctr = new ethers.Contract(CONTRACT_ADDRESS, CHAINLANCE_ABI, s);
      setProvider(prov);
      setSigner(s);
      setAccount(addr);
      setContract(ctr);
      setIsConnected(true);
      return { success: true, account: addr };
    } catch (e) {
      return {
        success: false,
        error: e?.shortMessage || e?.message || "User rejected",
      };
    }
  };

  const disconnect = () => {
    setProvider(null);
    setSigner(null);
    setAccount("");
    setContract(null);
    setIsConnected(false);
  };

  // read-only contract (RPC üzerinden)
  const getChainLanceReadOnly = () => {
    if (!readProvider) return null;
    return new ethers.Contract(CONTRACT_ADDRESS, CHAINLANCE_ABI, readProvider);
  };

  // init readProvider + auto connect if authorized
  useEffect(() => {
    // **READ PROVIDER** (Alchemy Monad testnet)
    try {
      const rp = new ethers.JsonRpcProvider(MONAD_RPC);
      setReadProvider(rp);
    } catch (e) {
      console.warn("Failed to init read provider:", e);
    }

    if (!window.ethereum) return;

    // MetaMask varsa—daha önce yetkiliyse otomatik bağla
    const prov = new ethers.BrowserProvider(window.ethereum);
    prov.listAccounts().then(async (accs) => {
      if (accs.length) {
        const s = await prov.getSigner();
        const addr = await s.getAddress();
        setProvider(prov);
        setSigner(s);
        setAccount(addr);
        setContract(new ethers.Contract(CONTRACT_ADDRESS, CHAINLANCE_ABI, s));
        setIsConnected(true);
      }
    });

    // account / chain değişiklikleri
    const onAcc = (accs) => (accs.length ? setAccount(accs[0]) : disconnect());
    const onChain = () => window.location.reload();
    window.ethereum?.on?.("accountsChanged", onAcc);
    window.ethereum?.on?.("chainChanged", onChain);
    return () => {
      window.ethereum?.removeListener?.("accountsChanged", onAcc);
      window.ethereum?.removeListener?.("chainChanged", onChain);
    };
  }, []);

  const value = useMemo(
    () => ({
      provider, // MetaMask
      readProvider, // Alchemy Monad testnet (read-only)
      signer,
      contract, // signer bağlı yazma contract’ı
      account,
      isConnected,
      connectWallet,
      disconnect,
      getChainLanceReadOnly, // read-only contract helper
      monadRpc: MONAD_RPC,
      contractAddress: CONTRACT_ADDRESS,
    }),
    [provider, readProvider, signer, contract, account, isConnected]
  );

  return <Web3Ctx.Provider value={value}>{children}</Web3Ctx.Provider>;
}

export const useWeb3 = () => useContext(Web3Ctx);
