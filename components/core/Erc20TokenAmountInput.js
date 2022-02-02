import Image from "next/image";
import { useState } from "react";
import { Button } from "./Button";
import { Erc20TokenInput } from "./Erc20TokenInput";
import { Input } from "./Input";
import styled from "styled-components";

const Container = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;

  column-gap: 12px;

  > input {
    width: 100%;
    height: 48px;
  }

  button {
    align-items: center;
    display: flex;
    justify-content: center;
    text-align: center;
    width: 100%;
    img {
      margin-right: 12px;
    }
  }
`;

export const Erc20TokenAmountInput = ({ value, onChange }) => {
  const [isShown, setIsShown] = useState(false);

  return (
    <Container>
      {value?.token ? (
        <Button secondary onClick={() => setIsShown(true)}>
          <img alt={"logo"} src={value.token.logoURI} height={25} width={25} />
          {value.token.symbol}
        </Button>
      ) : (
        <Button secondary onClick={() => setIsShown(true)}>
          Select a token
        </Button>
      )}

      <Input
        placeholder="Enter token amount (e.g. 12.31)"
        type="number"
        onChange={(e) => {
          const amount = e.target.value;
          onChange({ ...value, amount });
        }}
      />

      <Erc20TokenInput
        onChange={(token) => onChange({ ...value, token })}
        isShown={isShown}
        onClose={() => setIsShown(false)}
      />
    </Container>
  );
};
