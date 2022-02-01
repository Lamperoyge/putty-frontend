import { constants, Contract } from "ethers";
import { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { useAccount, useBlockNumber, useProvider, useSigner } from "wagmi";
import contracts from "../contracts.json";

export const useApprovals = (tokens) => {
  const [{ loading, data: signer }] = useSigner();
  const [{ data: account }] = useAccount();
  const [unapprovedTokens, setUnapprovedTokens] = useState();
  const [isLoading, setIsLoading] = useState();
  const [{ data: blockNumber }] = useBlockNumber({ watch: true });

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

              const approveToken = () => {
                setIsLoading(true);
                Token.approve(
                  contracts.contracts.Backspread.address,
                  constants.MaxUint256
                ).finally(() => setIsLoading(false));
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

  return [unapprovedTokens, isLoading];
};
