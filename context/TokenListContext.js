import { ethers } from "ethers";
import { createContext, useEffect, useState } from "react";
import { FetchWrapper } from "use-nft";

import { v4 as uuidv4 } from "uuid";
export const TokenListContext = createContext();

export const TokenListProvider = ({ children }) => {
  const [tokenList, setTokenList] = useState();
  const [nftCollections, setNftCollections] = useState();
  const [fetchWrapper, setFetchWrapper] = useState();

  useEffect(() => {
    const fetcher = ["ethers", { provider: ethers.getDefaultProvider() }];
    const fetchWrapper = new FetchWrapper(fetcher, {
      jsonProxy: (url) => "https://jsonp.afeld.me/?url=" + url,
    });
    setFetchWrapper(fetchWrapper);
  }, []);

  useEffect(() => {
    fetch("https://tokens.coingecko.com/uniswap/all.json")
      .then((res) => res.json())
      .then((res) =>
        setTokenList(res.tokens.map((t) => ({ ...t, id: uuidv4() })))
      )
      .catch(console.error);

    import("./nft-token-list.json").then((res) =>
      setNftCollections(
        res.tokens
          .map((t) => ({ ...t, id: uuidv4() }))
          .filter(
            ({ standard }) =>
              standard === "erc721" || standard === "cryptopunks"
          )
      )
    );
  }, []);

  return (
    <TokenListContext.Provider
      value={{ tokenList, nftCollections, fetchWrapper }}
    >
      {children}
    </TokenListContext.Provider>
  );
};
