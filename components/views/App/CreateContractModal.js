import { Input } from "../../core/Input";
import { Modal } from "../../layout/Modal";
import styled from "styled-components";
import { useState } from "react";
import { Button } from "../../core/Button";
import { Title } from "../../core/Title";

const Container = styled.div`
  display: grid;
  row-gap: 12px;

  button {
    width: 100%;
  }

  input {
    width: 100%;
  }

  label {
    margin-bottom: 8px;
    display: inline-block;
    font-weight: bold;
  }
`;

export const CreateContractModal = ({ isShown }) => {
  const [strikePrice, setStrikePrice] = useState();
  const [premiumPrice, setPremiumPrice] = useState();
  const [duration, setDuration] = useState();

  // duration - number
  // strike price - number
  // premium - number
  // underlying assets - struct

  return (
    <Modal isShown={isShown} title={"Create a new put contract"}>
      <Container>
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

        <div>
          <label>Underlying assets</label>

          <Button>Add ERC20 Token</Button>
          <Button>Add NFT</Button>
        </div>
      </Container>
    </Modal>
  );
};
