import styled from "styled-components";
import { useOpenOrders } from "../../../../hooks/useOpenOrders";
import { Button } from "../../../core/Button";
import { OpenOrderListItem } from "./OpenOrderListItem";

const Container = styled.div`
  display: grid;
  row-gap: 12px;
  height: fit-content;
  margin-bottom: 48px;

  .show-more {
    background-color: rgba(72, 149, 239, 0.2);
    color: ${({ theme }) => theme.tertiary};
  }
`;

export const OpenOrderList = () => {
  const [openOrders, loadMore, gotAllOrders] = useOpenOrders();

  console.log("open", openOrders);

  return (
    <Container>
      {openOrders?.map((order) => (
        <OpenOrderListItem order={order} key={order.orderHash} />
      ))}

      {!gotAllOrders && (
        <Button className="show-more" onClick={loadMore}>
          Show More
        </Button>
      )}
    </Container>
  );
};
