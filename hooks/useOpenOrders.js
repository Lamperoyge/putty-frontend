import { useContext, useEffect, useMemo, useState } from "react";
import { TokenListContext } from "../context/TokenListContext";
import { db } from "../firebase";

export const useOpenOrders = () => {
  const { tokenList, nftCollections } = useContext(TokenListContext);
  const [openOrders, setOpenOrders] = useState();

  const mappedTokenList = useMemo(() => {
    return tokenList?.reduce(
      (map, token) => ({ ...map, [token.address]: token }),
      {}
    );
  }, [tokenList]);

  const mappedNftCollections = useMemo(() => {
    return nftCollections?.reduce(
      (map, nft) => ({ ...map, [nft.address]: nft }),
      {}
    );
  }, [nftCollections]);

  useEffect(() => {
    if (mappedTokenList && mappedNftCollections) {
      db.collection("put-orders")
        .get()
        .then((data) => {
          setOpenOrders(
            data.docs.map((d) => {
              const order = d.data();

              const erc20UnderlyingMetaInfo = order.erc20Underlying.map(
                ({ token, amount }) => ({ ...mappedTokenList[token], amount })
              );

              const erc721UnderlyingMetaInfo = order.erc721Underlying.map(
                ({ token, tokenId }) => ({
                  ...mappedNftCollections[token],
                  tokenId,
                })
              );

              console.log(mappedNftCollections);
              console.log("meta", erc721UnderlyingMetaInfo);

              return {
                ...order,
                erc20UnderlyingMetaInfo,
                erc721UnderlyingMetaInfo,
              };
            })
          );
        });
    }
  }, [mappedTokenList, mappedNftCollections]);

  return [openOrders];
};
