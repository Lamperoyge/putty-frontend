import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import { useConnect } from "wagmi";
import { Modal } from "../layout/Modal";
import { Button } from "./Button";

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

export const icons = {
  injected: (
    <Image alt={"metamask"} src="/metamask.svg" height={30} width={30} />
  ),
  walletConnect: (
    <Image
      alt={"walletconnect"}
      src="/walletconnect.svg"
      height={30}
      width={30}
    />
  ),
  walletLink: (
    <Image alt={"walletlink"} src="/walletlink.svg" height={30} width={30} />
  ),
};

export const ConnectWalletButton = () => {
  const [isShown, setIsShown] = useState(false);
  const [{ data, error }, connect] = useConnect();

  return (
    <>
      <Button onClick={() => setIsShown(true)}>Connect Wallet</Button>

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
    </>
  );
};
