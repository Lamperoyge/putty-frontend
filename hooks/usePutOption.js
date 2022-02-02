import { arrayify, defaultAbiCoder, keccak256 } from "ethers/lib/utils";
import { useState } from "react";
import { useAccount, useContractRead, useSigner, useSignMessage } from "wagmi";
import contracts from "../contracts.json";
import { db } from "../firebase.js";

export const usePutOption = (option) => {
  const [error, setError] = useState({});
  const [{ data: account }] = useAccount();
  const [{ data: signer }] = useSigner();
  const [{ data: domainSeparatorV4 }] = useContractRead(
    {
      addressOrName: contracts.contracts.Backspread.address,
      contractInterface: contracts.contracts.Backspread.abi,
    },
    "domainSeparatorV4"
  );

  const submitPutOption = async () => {
    const optionTypes = [
      "bytes32",
      "uint",
      "uint",
      "uint",
      "address",
      "uint",
      "bytes32",
      "bytes32",
    ];

    console.log("durtion", option.duration);

    const error = {
      strike: option.strike > 0,
      premium: option.premium > 0,
      duration: option.duration > 0,
      hasUnderlying: Boolean(
        option.erc20Underlying.length || option.erc721Underlying.length
      ),
    };

    setError(error);

    if (Object.values(error).some((v) => !v)) {
      return;
    }

    const hashedErc20Underlying = keccak256(
      defaultAbiCoder.encode(
        ["(address, uint)[]"],
        [option.erc20Underlying.map((v) => [v.token, v.amount])]
      )
    );

    const hashedErc721Underlying = keccak256(
      defaultAbiCoder.encode(
        ["(address, uint)[]"],
        [option.erc721Underlying.map((v) => [v.token, v.tokenId])]
      )
    );

    option.owner = account.address;
    option.nonce = parseInt(Math.floor(Math.random() * 1_000_000_000));

    const orderHash = keccak256(
      defaultAbiCoder.encode(optionTypes, [
        domainSeparatorV4,
        option.strike,
        option.duration,
        option.premium,
        option.owner,
        option.nonce,
        hashedErc20Underlying,
        hashedErc721Underlying,
      ])
    );

    const signature = await signer.signMessage(arrayify(orderHash));

    const dbRes = await db.collection("put-orders").add({
      ...option,
      orderHash,
      signature,
    });

    console.log("res", dbRes);
  };

  return { submitPutOption, error };
};
