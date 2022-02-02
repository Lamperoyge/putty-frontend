import { useEffect, useState } from "react";
import { db } from "../firebase";

export const useOpenOrders = () => {
  const [openOrders, setOpenOrders] = useState();

  useEffect(() => {
    db?.collection("put-orders")
      .get()
      .then((data) => {
        setOpenOrders(data.docs.map((d) => d.data()));
      });
  }, []);

  return [openOrders];
};
