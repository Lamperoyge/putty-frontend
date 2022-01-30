import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import { useAccount, useConnect } from "wagmi";
import { Button } from "../core/Button";
import { Title } from "../core/Title";
import { Modal } from "./Modal";

const Container = styled.nav`
  padding: 24px;
  display: flex;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background-color: white;
`;

const ConnectButtonContainer = styled.div`
  display: grid;
  row-gap: 12px;
  max-width: 80vw;
  width: 300px;

  button {
    background-color: ${({ theme }) => theme.grey};
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .error {
    color: red;
  }
`;

const AccountContainer = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  h1 {
    margin-left: 12px;
  }
`;

const icons = {
  injected: <Image src="/metamask.svg" height={30} width={30} />,
  walletConnect: <Image src="/walletconnect.svg" height={30} width={30} />,
  walletLink: <Image src="/walletlink.svg" height={30} width={30} />,
};

export const Header = () => {
  const [{ data, error }, connect] = useConnect();
  const [isShown, setIsShown] = useState(false);
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });

  return (
    <Container>
      <Title>Putty</Title>

      {accountData ? (
        <AccountContainer onClick={disconnect}>
          {icons[accountData.connector.id]}
          <Title>
            {accountData.ens?.name ||
              `${accountData.address.slice(0, 6)}...${accountData.address.slice(
                -6
              )}`}
          </Title>
        </AccountContainer>
      ) : (
        <Button onClick={() => setIsShown(true)}>Connect Wallet</Button>
      )}

      <Modal
        isShown={isShown}
        title={"Connect Wallet"}
        onClose={() => setIsShown(false)}
      >
        <ConnectButtonContainer>
          {data.connectors.map((x) => (
            <Button
              disabled={!x.ready}
              key={x.id}
              onClick={() => connect(x).then(() => setIsShown(false))}
            >
              {x.name}
              {!x.ready && " (unsupported)"}
              {icons[x.id]}
            </Button>
          ))}

          {error && (
            <div className="error">{error?.message ?? "Failed to connect"}</div>
          )}
        </ConnectButtonContainer>
      </Modal>
    </Container>
  );
};
