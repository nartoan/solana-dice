"use client";

import { AnchorProvider, Idl, Program } from "@coral-xyz/anchor";
import IDL from "./idl.json";
import {
  clusterApiUrl,
  Commitment,
  Connection,
  PublicKey,
} from "@solana/web3.js";
import { SOLANA_NETWORK } from "@/const";
// import { useConnection } from "@solana/wallet-adapter-react";

const programID = new PublicKey("B4xgkC1id6Liyk6TvojjtP4BvRPPipTr8iriLFy8ywTb");
const housePublicKey = new PublicKey(
  "4fiLLb9Lxaa9iB8gGFPJvy81NRDBCA15q4Jw2ZekQ1U9"
);

const opts = {
  preflightCommitment: "processed" as Commitment,
};

export const useAnchor = () => {
  const connection = new Connection(clusterApiUrl(SOLANA_NETWORK) , opts.preflightCommitment);
  const provider = new AnchorProvider(connection, window.solana, opts);
  // Initialize the program interface with the IDL, program ID, and connection.
  // This setup allows us to interact with the on-chain program using the defined interface.
  const program = new Program(IDL as Idl, programID, provider);

  const [payoutHistoryPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("payout_history"), housePublicKey.toBuffer()],
    program.programId
  );

  const [betListPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("bet_list"), housePublicKey.toBuffer()],
    program.programId
  );

  return {
    program,
    programID,
    housePublicKey,
    connection,
    payoutHistoryPda,
    betListPda,
  };
};
