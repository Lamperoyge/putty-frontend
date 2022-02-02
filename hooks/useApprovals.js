import { constants, Contract } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useBlockNumber, useProvider, useSigner } from "wagmi";
import contracts from "../contracts.json";
import { useLocalStorage } from "./useLocalStorage";

export const useApprovals = (tokens) => {
  const [{ loading, data: signer }] = useSigner();
  const [{ data: account }] = useAccount();
  const [unapprovedTokens, setUnapprovedTokens] = useState();
  const [isLoading, setIsLoading] = useState();
  const [{ data: blockNumber }] = useBlockNumber({ watch: true });
  const [isApproving, setIsApproving] = useLocalStorage("isApproving", {});

  useEffect(() => {
    const startIsApprovingListeners = async () => {
      const approvalTxHashes = Object.values(isApproving)
        .map(Object.entries)
        .flat()
        .filter(([address, txHash]) => txHash);

      console.log(signer);
      console.log("hashes", approvalTxHashes);

      if (signer) {
        const res = approvalTxHashes.map(([address, txHash]) =>
          signer.provider.waitForTransaction(txHash).then(() =>
            setIsApproving((old) => ({
              ...old,
              [account.address]: {
                ...old[account.address],
                [address]: false,
              },
            }))
          )
        );
      }
    };

    startIsApprovingListeners();
  }, [signer]);

  useEffect(() => {
    const getUnapprovedTokens = async () => {
      if (signer && account?.address) {
        console.log(blockNumber);

        const approvals = await Promise.all(
          tokens.map(async (token) => {
            const { address, type, tokenId } = token;
            if (type === "ERC20") {
              const Token = new Contract(
                address,
                contracts.contracts.ERC20.abi,
                signer
              );

              const symbol = await Token.symbol();
              const allowance = await Token.allowance(
                account.address,
                contracts.contracts.Backspread.address
              );

              const isApproved = allowance.gt(constants.MaxUint256.div("2"));

              const approveToken = async () => {
                const tx = await Token.approve(
                  contracts.contracts.Backspread.address,
                  constants.MaxUint256
                );

                setIsApproving((old) => ({
                  ...old,
                  [account.address]: {
                    ...old[account.address],
                    [address]: tx.hash,
                  },
                }));

                tx.wait().finally(() =>
                  setIsApproving((old) => ({
                    ...old,
                    [account.address]: {
                      ...old[account.address],
                      [address]: false,
                    },
                  }))
                );
              };

              return [isApproved, { ...token, symbol, approveToken }];
            }
          })
        );

        const unapprovedTokens = approvals
          .filter(([isApproved]) => !isApproved)
          .map(([, token]) => token);

        setUnapprovedTokens(unapprovedTokens);
      }
    };

    getUnapprovedTokens();
  }, [signer, account?.address, blockNumber]);

  return [unapprovedTokens, isApproving, isLoading];
};
