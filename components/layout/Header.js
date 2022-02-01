import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import { useAccount, useConnect } from "wagmi";
import { ConnectWalletButton, icons } from "../core/ConnectWalletButton";
import { Title } from "../core/Title";

const Container = styled.nav`
  display: flex;
  justify-content: space-between;
  position: sticky;
  padding-top: 48px;
  padding-bottom: 12px;
  top: 0;
  background-color: white;
  height: fit-content;
`;

const AccountContainer = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  h1 {
    margin-left: 12px;
  }
`;

export const Header = () => {
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
        <ConnectWalletButton />
      )}
    </Container>
  );
};
