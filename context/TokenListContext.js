import { createContext, useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
export const TokenListContext = createContext();

export const TokenListProvider = ({ children }) => {
  const [tokenList, setTokenList] = useState();
  const [nftCollections, setNftCollections] = useState();

  useEffect(() => {
    fetch("https://tokens.coingecko.com/uniswap/all.json")
      .then((res) => res.json())
      .then((res) =>
        setTokenList(res.tokens.map((t) => ({ ...t, id: uuidv4() })))
      )
      .catch(console.error);

    import("./nft-token-list.json").then((res) =>
      setNftCollections(res.tokens.map((t) => ({ ...t, id: uuidv4() })))
    );
  }, []);

  return (
    <TokenListContext.Provider value={{ tokenList, nftCollections }}>
      {children}
    </TokenListContext.Provider>
  );
};
