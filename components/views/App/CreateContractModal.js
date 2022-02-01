import { Input } from "../../core/Input";
import { Modal } from "../../layout/Modal";
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../../core/Button";
import { Title } from "../../core/Title";
import { v4 as uuidv4 } from "uuid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { TokenInputModal } from "../../core/TokenInputModal";
import Image from "next/image";
import { NftInputModal } from "../../core/NftInputModal";
import { FetchWrapper } from "use-nft";
import { ethers } from "ethers";

const Container = styled.div`
  width: 500px;
  display: grid;
  row-gap: 24px;

  button {
    width: 100%;
  }

  input {
    width: 100%;
  }

  label {
    font-weight: bold;
  }

  .number-input {
    label {
      margin-bottom: 8px;
      display: inline-block;
    }
  }

  .underlying-input {
    display: grid;
    row-gap: 12px;

    .buttons > button {
      background-color: rgba(72, 149, 239, 0.2);
      color: ${({ theme }) => theme.tertiary};
    }

    .buttons {
      display: flex;
    }
  }

  .erc721-input {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    align-items: center;

    > input {
      margin-left: 12px;
      margin-right: 12px;
      width: auto;
    }

    .bin {
      display: none !important;
    }

    &:hover {
      .bin {
        display: block !important;
        cursor: pointer;
      }
    }

    button {
      align-items: center;
      display: flex;
      justify-content: center;
      text-align: center;
      img {
        margin-right: 12px;
      }
    }
  }

  .erc20-input {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;

    > input {
      margin-left: 12px;
      margin-right: 12px;
      width: auto;
    }

    .bin {
      display: none !important;
    }

    &:hover {
      .bin {
        display: block !important;
        cursor: pointer;
      }
    }

    button {
      align-items: center;
      display: flex;
      justify-content: center;
      text-align: center;
      img {
        margin-right: 12px;
      }
    }
  }
`;

const InformationContainer = styled.div`
  background-color: rgba(72, 149, 239, 0.2);
  padding: 12px;
  color: black;
  line-height: 24px;
  font-size: 16px;
`;

const useUnderlyingAssets = () => {
  const [underlyingAssets, setUnderlyingAssets] = useState([]);

  const addUnderlyingAsset = useCallback(
    (type) => {
      setUnderlyingAssets((old) => old.concat({ id: uuidv4(), type }));
    },
    [underlyingAssets]
  );

  const removeUnderlyingAsset = useCallback(
    (idToRemove) => {
      setUnderlyingAssets((old) => old.filter(({ id }) => id !== idToRemove));
    },
    [underlyingAssets]
  );

  console.log(underlyingAssets);

  const updateUnderlyingAsset = useCallback(
    (newValue, idToChange) => {
      setUnderlyingAssets((oldAssets) => {
        const newAsssets = [...oldAssets];
        const index = newAsssets.findIndex(({ id }) => id === idToChange);
        newAsssets[index] = newValue;
        return newAsssets;
      });
    },
    [underlyingAssets]
  );

  return [
    underlyingAssets,
    addUnderlyingAsset,
    removeUnderlyingAsset,
    updateUnderlyingAsset,
  ];
};

const UnderlyingAssetInput = ({ value, removeUnderlyingAsset, onChange }) => {
  const [isShown, setIsShown] = useState(false);
  const [nftImageSrc, setNftImageSrc] = useState();

  useEffect(async () => {
    if (value?.type === "ERC721" && value?.selectedAsset) {
      const fetcher = ["ethers", { provider: ethers.getDefaultProvider() }];

      const fetchWrapper = new FetchWrapper(fetcher);

      const result = await fetchWrapper.fetchNft(
        value.selectedAsset.address,
        value.tokenId || 1
      );

      setNftImageSrc(result.image);
    }
  }, [value]);

  if (value.type === "ERC20") {
    return (
      <div className="erc20-input">
        {value?.selectedAsset ? (
          <Button secondary onClick={() => setIsShown(true)}>
            <img
              alt={"logo"}
              src={value.selectedAsset.logoURI}
              height={25}
              width={25}
            />
            {value.selectedAsset.symbol}
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

        <div className="bin" onClick={() => removeUnderlyingAsset(value.id)}>
          <Image alt={"delete"} src="/bin.svg" height={30} width={30} />
        </div>

        <TokenInputModal
          onChange={(selectedAsset) => onChange({ ...value, selectedAsset })}
          isShown={isShown}
          onClose={() => setIsShown(false)}
        />
      </div>
    );
  }

  if (value.type === "ERC721") {
    return (
      <div className="erc721-input">
        {value?.selectedAsset ? (
          <Button secondary onClick={() => setIsShown(true)}>
            <img
              alt={"logo"}
              src={value.selectedAsset.logoURI}
              height={25}
              width={25}
            />
            {value.selectedAsset.name}
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

        <img
          alt={"nft-picture"}
          className="nft-picture"
          src={nftImageSrc}
          height={50}
        />

        <div className="bin" onClick={() => removeUnderlyingAsset(value.id)}>
          <Image alt={"delete"} src="/bin.svg" height={30} width={30} />
        </div>

        <NftInputModal
          onChange={(selectedAsset) => onChange({ ...value, selectedAsset })}
          isShown={isShown}
          onClose={() => setIsShown(false)}
        />
      </div>
    );
  }

  console.error("Invalid asset type", asset.type);
  return <div></div>;
};

export const CreateContractModal = ({ isShown, onClose }) => {
  const [strikePrice, setStrikePrice] = useState();
  const [premiumPrice, setPremiumPrice] = useState();
  const [duration, setDuration] = useState();
  const [
    underlyingAssets,
    addUnderlyingAsset,
    removeUnderlyingAsset,
    updateUnderlyingAsset,
  ] = useUnderlyingAssets();

  // duration - number
  // strike price - number
  // premium - number
  // underlying assets - struct

  return (
    <Modal
      isShown={isShown}
      title={"Create a new put contract"}
      onClose={onClose}
    >
      <Container>
        <div className="underlying-input">
          <label>Underlying Assets</label>

          {!underlyingAssets.length ? (
            <div>No assets...</div>
          ) : (
            underlyingAssets.map((asset) => (
              <UnderlyingAssetInput
                removeUnderlyingAsset={removeUnderlyingAsset}
                value={asset}
                onChange={(v) => updateUnderlyingAsset(v, asset.id)}
                key={asset.id}
              />
            ))
          )}

          <div className="buttons">
            <Button
              style={{ marginRight: 12 }}
              onClick={() => addUnderlyingAsset("ERC721")}
            >
              Add NFT
            </Button>
            <Button onClick={() => addUnderlyingAsset("ERC20")}>
              Add ERC20 Token
            </Button>
          </div>
        </div>
        <div className="number-input">
          <label>Strike Price (ETH)</label>
          <Input
            value={strikePrice}
            onChange={(e) =>
              e.target.value >= 0 && setStrikePrice(e.target.value)
            }
            placeholder="5.0 ETH"
            type="number"
          />
        </div>
        <div className="number-input">
          <label>Premium Price (ETH)</label>
          <Input
            placeholder="0.1 ETH"
            type="number"
            value={premiumPrice}
            onChange={(e) =>
              e.target.value >= 0 && setPremiumPrice(e.target.value)
            }
          />
        </div>
        <div className="number-input">
          <label>Duration (Days)</label>
          <Input
            placeholder="7 days"
            type="number"
            value={duration && parseInt(duration)}
            onChange={(e) => setDuration(parseInt(e.target.value))}
          />
        </div>

        <InformationContainer>
          You pay <b>{premiumPrice} ETH</b> and receive an option to sell your
          assets for <b>{strikePrice} ETH</b> within <b>{duration} days</b>
        </InformationContainer>

        <Button>Create Put Contract</Button>
      </Container>
    </Modal>
  );
};
