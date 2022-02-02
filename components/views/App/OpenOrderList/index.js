import styled from "styled-components";
import { useOpenOrders } from "../../../../hooks/useOpenOrders";
import { OpenOrderListItem } from "./OpenOrderListItem";

const Container = styled.div`
  display: grid;
  row-gap: 12px;
  height: fit-content;
`;

export const OpenOrderList = () => {
  const [openOrders] = useOpenOrders();

  console.log("open", openOrders);

  return (
    <Container>
      {openOrders?.map((order) => (
        <OpenOrderListItem order={order} key={order.orderHash} />
      ))}
    </Container>
  );
};
