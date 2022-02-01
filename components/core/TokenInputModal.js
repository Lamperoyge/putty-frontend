import { Modal } from "../layout/Modal";
import { Input } from "./Input";
import styled from "styled-components";
import Image from "next/image";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { useState } from "react";
import debounce from "debounce";
import { TokenListContext } from "../../context/TokenListContext";
import { Button } from "./Button";

const Container = styled.div`
  display: grid;
  row-gap: 24px;
  width: 400px;

  .tokens-list {
    display: grid;
    row-gap: 2px;
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: bold;
      padding: 12px;
      border-radius: 3px;
      &:hover {
        background-color: ${({ theme }) => theme.lightGrey};
        cursor: pointer;
      }
      img {
        margin-left: 24px;
      }
    }
  }

  .show-more {
    background-color: rgba(72, 149, 239, 0.2);
    color: ${({ theme }) => theme.tertiary};
  }
`;

export const TokenInputModal = ({ isShown, onChange, onClose }) => {
  const { tokenList: tokens } = useContext(TokenListContext);
  const [amountToShow, setAmountToShow] = useState(100);
  const [searchTerm, setSearchTerm] = useState();

  const setDebounceSearchTerm = useCallback(debounce(setSearchTerm, 50), [
    setSearchTerm,
  ]);

  const filteredTokens = useMemo(() => {
    return tokens?.filter(({ address, name, symbol }) =>
      [address, name, symbol].some(
        (v) =>
          !searchTerm || v.toLowerCase().startsWith(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, tokens]);

  useEffect(() => {
    setAmountToShow(100);
  }, [isShown]);

  return (
    <Modal isShown={isShown} title={"Select a token"} onClose={onClose}>
      <Container>
        <Input
          placeholder="Search for address, name or symbol"
          onChange={(e) => setDebounceSearchTerm(e.target.value)}
        />

        <div className="tokens-list">
          {filteredTokens &&
            filteredTokens.slice(0, amountToShow).map((token) => (
              <div
                key={token.id}
                onClick={() => {
                  onChange(token);
                  onClose();
                }}
              >
                <div>
                  {token.name} ({token.symbol})
                </div>
                <img
                  alt={token.name}
                  src={token.logoURI}
                  height={30}
                  width={30}
                  loading="lazy"
                />
              </div>
            ))}
        </div>

        <Button
          className="show-more"
          onClick={() => setAmountToShow(amountToShow + 100)}
        >
          Show more
        </Button>
      </Container>
    </Modal>
  );
};
