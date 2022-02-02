import { Input } from "../../core/Input";
import { Modal } from "../../layout/Modal";
import styled from "styled-components";
import { useCallback, useContext, useEffect, useState } from "react";
import { Button } from "../../core/Button";
import { Title } from "../../core/Title";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import {
  NftCollectionInput,
  NftInputModal,
} from "../../core/NftCollectionInput";
import { FetchWrapper } from "use-nft";
import { ethers } from "ethers";
import { useConnect, useSignMessage } from "wagmi";
import { ConnectWalletButton } from "../../core/ConnectWalletButton";
import { ApproveButton } from "../../core/ApproveButton";
import contracts from "../../../contracts.json";
import { usePutOption } from "../../../hooks/usePutOption";
import { TokenListContext } from "../../../context/TokenListContext";
import { NftTokenInput } from "../../core/NftTokenInput";
import { Erc20TokenInput } from "../../core/Erc20TokenInput";
import { Erc20TokenAmountInput } from "../../core/Erc20TokenAmountInput";

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

  .token-input {
    width: 100%;

    .bin {
      display: none !important;
      margin-left: 12px;
    }

    &:hover {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;

      .bin {
        display: block !important;
        cursor: pointer;
      }
    }
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
  return (
    <div className="token-input">
      {value.type === "ERC20" ? (
        <Erc20TokenAmountInput value={value} onChange={onChange} />
      ) : (
        <NftTokenInput value={value} onChange={onChange} />
      )}

      <div className="bin" onClick={() => removeUnderlyingAsset(value.id)}>
        <Image alt={"delete"} src="/bin.svg" height={30} width={30} />
      </div>
    </div>
  );
};

export const CreateContractModal = ({ isShown, onClose }) => {
  const [strikePrice, setStrikePrice] = useState();
  const [premiumPrice, setPremiumPrice] = useState();
  const [duration, setDuration] = useState();
  const [{ data }] = useConnect();
  const [
    underlyingAssets,
    addUnderlyingAsset,
    removeUnderlyingAsset,
    updateUnderlyingAsset,
  ] = useUnderlyingAssets();

  const { submitPutOption, error } = usePutOption({
    strike: strikePrice,
    premium: premiumPrice,
    duration,
    erc20Underlying: underlyingAssets
      .filter(({ type, selectedAsset }) => type === "ERC20" && selectedAsset)
      .map(({ selectedAsset: { address }, amount }) => ({
        token: address,
        amount,
      })),
    erc721Underlying: underlyingAssets
      .filter(({ type, selectedAsset }) => type === "ERC721" && selectedAsset)
      .map(({ selectedAsset: { address }, tokenId }) => ({
        token: address,
        tokenId,
      })),
  });

  console.log(error);

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
            error={error.strike === false}
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
            error={error.duration === false}
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
            error={error.duration === false}
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

        {!data?.connected ? (
          <ConnectWalletButton />
        ) : (
          <ApproveButton
            onClick={() => submitPutOption()}
            tokens={[
              {
                address: contracts.contracts.WETH9.address,
                type: "ERC20",
              },
            ]}
          >
            Create Put Contract
          </ApproveButton>
        )}
      </Container>
    </Modal>
  );
};
