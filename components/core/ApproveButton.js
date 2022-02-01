import { TailSpin } from "react-loader-spinner";
import { useApprovals } from "../../hooks/useApprovals";
import { Button } from "./Button";
import { Spinner } from "./Spinner";
import styled from "styled-components";

const Container = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;

  .spinner {
    margin-left: 24px;
  }
`;

export const ApproveButton = ({ tokens, children }) => {
  const [unapprovedTokens, isLoading] = useApprovals(tokens);

  return unapprovedTokens?.length ? (
    <Container onClick={() => !isLoading && unapprovedTokens[0].approveToken()}>
      Approve {unapprovedTokens[0].symbol}{" "}
      {isLoading && <Spinner color={"white"} />}
    </Container>
  ) : (
    <Button>{children}</Button>
  );
};
