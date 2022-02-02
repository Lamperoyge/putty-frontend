import { TailSpin } from "react-loader-spinner";
import { useApprovals } from "../../hooks/useApprovals";
import { Button } from "./Button";
import { Spinner } from "./Spinner";
import styled from "styled-components";
import { useAccount } from "wagmi";

const Container = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;

  .spinner {
    margin-left: 24px;
  }
`;

export const ApproveButton = ({ tokens, children, ...props }) => {
  const [{ data: account }] = useAccount();
  const [unapprovedTokens, isApproving] = useApprovals(tokens);

  return unapprovedTokens?.length ? (
    isApproving[account.address]?.[unapprovedTokens[0].address] ? (
      <Container>
        Approving {unapprovedTokens[0].symbol} <Spinner color={"white"} />
      </Container>
    ) : (
      <Container onClick={() => unapprovedTokens[0].approveToken()}>
        Approve {unapprovedTokens[0].symbol}
      </Container>
    )
  ) : (
    <Button {...props}>{children}</Button>
  );
};
