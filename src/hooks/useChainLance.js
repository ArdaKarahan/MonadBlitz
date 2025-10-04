// src/hooks/useChainLance.js
import { useCallback } from "react";
import { ethers, id as keccakId, Interface } from "ethers";
import { useWeb3 } from "../contexts/Web3Context";
import { CHAINLANCE_ABI } from "../contracts/chainlanceAbi";

export function useChainLance() {
  const { provider, contract, account } = useWeb3();
  const iface = new Interface(CHAINLANCE_ABI);

  // ----- Account -----
  const createAccount = useCallback(async (role) => {
    // role: "Employee" | "Employer" | "Middleman"
    const isEmp = role === "Employee";
    const isEr  = role === "Employer";
    const isMid = role === "Middleman";
    const tx = await contract.newAccount(isEmp, isEr, isMid);
    await tx.wait();
    return true;
  }, [contract]);

  // ----- Employer -----
  const offerWork = useCallback(async (amountEth) => {
    const tx = await contract.offerWork({ value: ethers.parseEther(String(amountEth)) });
    await tx.wait();
  }, [contract]);

  const myOfferedWorks = useCallback(async () => {
    return await contract.getOfferedWorks(); // only caller's
  }, [contract]);

  const deleteWork = useCallback(async (id) => {
    const tx = await contract.deleteWork(id);
    await tx.wait();
  }, [contract]);

  const getCandidates = useCallback(async (id) => {
    return await contract.getCandidates(id); // only employer of that work
  }, [contract]);

  const recruitEmployee = useCallback(async (id, candidateIndex) => {
    const tx = await contract.recruitEmployee(id, candidateIndex);
    await tx.wait();
  }, [contract]);

  // ----- Employee (discover open works via events) -----
  const openWorks = useCallback(async () => {
    if (!provider) return [];
    const topic = iface.getEvent("workOffered").topicHash;
    const logs = await provider.getLogs({
      fromBlock: 0n,
      toBlock: "latest",
      address: contract.target,
      topics: [topic]
    });
    // Decode and fetch latest state for each id
    const ids = Array.from(new Set(logs.map(l => iface.decodeEventLog("workOffered", l.data, l.topics).offeredWorkId)));
    const rows = await Promise.all(ids.map(async (id) => {
      const ow = await contract.offeredWorks(id);
      return { ...ow, offeredWorkId: id };
    }));
    return rows.filter(w => w.isSealed === false);
  }, [provider, contract, iface]);

  const applyToWork = useCallback(async (id) => {
    const tx = await contract.applyOfferedWork(id);
    await tx.wait();
  }, [contract]);

  // ----- Agreements -----
  const myAgreements = useCallback(async () => {
    return await contract.getAgreements(); // both roles
  }, [contract]);

  const employeeDone = useCallback(async (agreementId) => {
    const tx = await contract.setEmployeeDone(agreementId);
    await tx.wait();
  }, [contract]);

  const employerValidate = useCallback(async (agreementId) => {
    const tx = await contract.setEmployerValidate(agreementId);
    await tx.wait();
  }, [contract]);

  // ----- Middleman flow -----
  const suggestMiddleman = useCallback(async (agreementId, middlemanAddr) => {
    const tx = await contract.suggestMiddleman(agreementId, middlemanAddr);
    await tx.wait();
  }, [contract]);

  const acceptAsMiddleman = useCallback(async (agreementId, whichIndex) => {
    const tx = await contract.middleManValidate(agreementId, whichIndex);
    await tx.wait();
  }, [contract]);

  const raiseDispute = useCallback(async (agreementId) => {
    const tx = await contract.raiseDispute(agreementId);
    await tx.wait();
  }, [contract]);

  const resolveDispute = useCallback(async (agreementId, empPct, erPct) => {
    const tx = await contract.resolveDisputeMiddleman(agreementId, empPct, erPct);
    await tx.wait();
  }, [contract]);

  return {
    account,
    createAccount,
    offerWork,
    myOfferedWorks,
    deleteWork,
    getCandidates,
    recruitEmployee,
    openWorks,
    applyToWork,
    myAgreements,
    employeeDone,
    employerValidate,
    suggestMiddleman,
    acceptAsMiddleman,
    raiseDispute,
    resolveDispute,
  };
}
