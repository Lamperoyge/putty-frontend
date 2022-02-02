import { useContext, useEffect, useMemo, useState } from "react";
import { TokenListContext } from "../context/TokenListContext";
import { db } from "../firebase";
import { useFirestoreQuery } from "./useFirestore";

export const useOpenOrders = () => {
  const { tokenList, nftCollections } = useContext(TokenListContext);
  const [openOrders, setOpenOrders] = useState();
  const [lastDoc, setLastDoc] = useState();
  const [rawOpenOrders, setRawOpenOrders] = useState([]);
  const [gotAllOrders, setGotAllOrders] = useState(false);

  console.log("LAST DOCrtsrst", lastDoc);
  const {
    status,
    data: lastOrders,
    error,
  } = useFirestoreQuery(
    db
      .collection("put-orders")
      .orderBy("creationTimestamp", "desc")
      .startAfter(lastDoc?.creationTimestamp || {})
      .limit(20)
  );

  useEffect(() => {
    console.log("LT", lastOrders);
    if (
      lastOrders &&
      rawOpenOrders.every(
        ({ id }) => !lastOrders.some(({ id: lid }) => lid === id)
      )
    ) {
      setRawOpenOrders((old) => old.concat(lastOrders));
      if (lastOrders.length === 0) {
        setGotAllOrders(true);
      }
    }
  }, [lastOrders]);

  console.log("statuse", status);
  console.log("data", rawOpenOrders);
  console.log("res", lastOrders);
  console.log("error", error);

  useEffect(() => {
    if (rawOpenOrders && tokenList && nftCollections) {
      setOpenOrders(
        rawOpenOrders.map((order) => {
          const erc20UnderlyingMetaInfo = order.erc20Underlying.map(
            ({ token, amount }) => ({
              ...tokenList.find(({ address }) => address === token),
              amount,
            })
          );

          const erc721UnderlyingMetaInfo = order.erc721Underlying.map(
            ({ token, tokenId }) => ({
              ...nftCollections.find(({ address }) => address === token),
              tokenId,
            })
          );

          console.log("meta", erc721UnderlyingMetaInfo);

          return {
            ...order,
            erc20UnderlyingMetaInfo,
            erc721UnderlyingMetaInfo,
          };
        })
      );
    }
  }, [nftCollections, tokenList, rawOpenOrders]);

  const loadMore = () => {
    return (
      !gotAllOrders &&
      setLastDoc(lastOrders && lastOrders[lastOrders.length - 1])
    );
  };

  return [openOrders, loadMore, gotAllOrders];
};
