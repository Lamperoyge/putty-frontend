import { Modal } from "../layout/Modal";
import { Input } from "./Input";
import styled from "styled-components";
import Image from "next/image";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { useState } from "react";
import debounce from "debounce";
import { TokenListContext } from "../../context/TokenListContext";
import { Button } from "./Button";
import { useDebounce } from "use-debounce";

const Container = styled.div`
  display: grid;
  row-gap: 24px;
  width: 500px;

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
      overflow-wrap: break-word;
      word-break: break-word;
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

export const NftCollectionInput = ({ isShown, onChange, onClose }) => {
  const { nftCollections } = useContext(TokenListContext);
  const [amountToShow, setAmountToShow] = useState(100);
  const [_searchTerm, setSearchTerm] = useState();
  const [searchTerm] = useDebounce(_searchTerm, 50);

  const filteredNftCollections = useMemo(() => {
    return nftCollections?.filter(({ address, name, symbol }) =>
      [address, name, symbol].some(
        (v) =>
          !searchTerm || v?.toLowerCase().startsWith(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  useEffect(() => {
    setAmountToShow(100);
  }, [isShown]);

  return (
    <Modal isShown={isShown} title={"Select a collection"} onClose={onClose}>
      <Container>
        <Input
          placeholder="Search for address, name or symbol"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="tokens-list">
          {filteredNftCollections &&
            filteredNftCollections.slice(0, amountToShow).map((collection) => (
              <div
                key={collection.id}
                onClick={() => {
                  onChange(collection);
                  onClose();
                }}
              >
                <div>
                  {collection.name}{" "}
                  {collection.symbol ? `(${collection.symbol})` : null}
                </div>
                <img
                  alt={collection.name}
                  src={collection.logoURI}
                  height={30}
                  width={30}
                  loading="lazy"
                />
              </div>
            ))}
        </div>

        {!searchTerm && (
          <Button
            className="show-more"
            onClick={() => setAmountToShow(amountToShow + 100)}
          >
            Show more
          </Button>
        )}
      </Container>
    </Modal>
  );
};
