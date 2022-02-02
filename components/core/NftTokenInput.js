import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { TokenListContext } from "../../context/TokenListContext";
import { Button } from "./Button";
import { Input } from "./Input";
import { NftCollectionInput } from "./NftCollectionInput";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  column-gap: 12px;

  > input {
    width: auto !important;
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

export const NftTokenInput = ({ value, onChange }) => {
  const [isShown, setIsShown] = useState(false);
  const [nftImageSrc, setNftImageSrc] = useState();
  const { fetchWrapper } = useContext(TokenListContext);

  useEffect(async () => {
    if (value.collection && value.tokenId && fetchWrapper) {
      const result = await fetchWrapper.fetchNft(
        value.collection.address,
        value.tokenId || 1
      );

      setNftImageSrc(result.image);
    }
  }, [value, fetchWrapper]);

  return (
    <Container className="erc721-input">
      {value?.collection ? (
        <Button secondary onClick={() => setIsShown(true)}>
          <img
            alt={"logo"}
            src={value.collection.logoURI}
            height={25}
            width={25}
          />

          {value.collection.name}
        </Button>
      ) : (
        <Button secondary onClick={() => setIsShown(true)}>
          Select an NFT
        </Button>
      )}

      <Input
        placeholder="Enter token ID"
        type="number"
        onChange={(e) => {
          const tokenId = parseInt(e.target.value);
          onChange({ ...value, tokenId });
        }}
      />

      {nftImageSrc && (
        <img
          alt={"nft-picture"}
          className="nft-picture"
          src={nftImageSrc}
          height={50}
        />
      )}

      <NftCollectionInput
        onChange={(collection) => onChange({ ...value, collection })}
        isShown={isShown}
        onClose={() => setIsShown(false)}
      />
    </Container>
  );
};
