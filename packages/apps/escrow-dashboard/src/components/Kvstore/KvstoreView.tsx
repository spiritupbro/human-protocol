import React, { useState, useEffect } from "react";
import { MainPage } from "./MainPage";
import { AfterConnect } from "./AfterConnect";
import { Dashboard } from "./Dashboard";
import { useAccount, useContractRead,useNetwork } from "wagmi";
import KVStore from "@human-protocol/core/abis/KVStore.json";
import {ESCROW_NETWORKS,ChainId} from "../../constants"
export const KvstoreView = (): React.ReactElement => {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork()
  const [publicKey, setPublicKey] = useState<string>("");
  const [step, setStep] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [pubkeyExist, setPubkeyExist] = useState<boolean>(false);
  const { data, refetch } = useContractRead({
      address: ESCROW_NETWORKS[chain?.id as ChainId]?.kvstoreAddress as `0x${string}`,
    abi: KVStore,
    functionName: "get",
    args: [address, "public_key"]
  });
useEffect(()=>{
    if(publicKey?.trim().length === 0){
        setStep(0);
        setPage(0)
    }
    setPublicKey(data as string)
    if(data as string){
        setPubkeyExist(true)
    }
},[data,chain])
  return (
    <>
      {!isConnected && <MainPage />}
    {isConnected && publicKey?.trim().length === 0 && <AfterConnect refetch={refetch} setPublicKey={setPublicKey} pubkeyExist={pubkeyExist} step={step} setStep={setStep} page={page} setPage={setPage}/>}
      {isConnected && publicKey?.trim().length > 0 &&
        <Dashboard  setStep={setStep}  setPage={setPage} publicKey={publicKey} refetch={refetch} setPublicKey={setPublicKey} />}
    </>
  );
};
