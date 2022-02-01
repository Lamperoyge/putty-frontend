import { createContext, useEffect, useState } from "react";

export const TokenListContext = createContext();

export const TokenListProvider = ({ children }) => {
  const [tokenList, setTokenList] = useState();
  const [nftCollections, setNftCollections] = useState();

  useEffect(() => {
    fetch("https://tokens.coingecko.com/uniswap/all.json")
      .then((res) => res.json())
      .then((res) => setTokenList(res.tokens))
      .catch(console.error);

    import("./nft-token-list.json").then((res) =>
      setNftCollections(res.tokens)
    );
  }, []);

  return (
    <TokenListContext.Provider value={{ tokenList, nftCollections }}>
      {children}
    </TokenListContext.Provider>
  );
};
