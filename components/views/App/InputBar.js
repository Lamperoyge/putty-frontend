import { useState } from "react";
import styled from "styled-components";
import { Button } from "../../core/Button";
import { Title } from "../../core/Title";
import { CreateContractModal } from "./CreateContractModal";

const Container = styled.div`
  display: flex;
  .create-button {
    margin-left: 48px;
  }
`;

export const InputBar = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <Container>
      <Title>Open orders</Title>
      <Button className="create-button" onClick={() => setShowModal(true)}>
        Create Put Contract
      </Button>

      <CreateContractModal isShown={showModal} />
    </Container>
  );
};
