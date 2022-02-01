import Image from "next/image";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { Title } from "../core/Title";

const Container = styled.div`
  position: fixed;
  background: white;
  border-radius: 6px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: fit-content;
  height: fit-content;
  padding: 24px;
  box-shadow: 0px 0px 19px 6px rgba(0, 0, 0, 0.18);
  max-width: 100%;
  overflow: auto;
  max-height: 95%;
  border: 1px solid ${({ theme }) => theme.lightGrey};

  .title-container {
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;

    h1 {
      margin-right: 48px;
    }

    img {
      cursor: pointer;
    }
  }
`;

const Backdrop = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background-color: rgba(1, 1, 1, 0.3);
`;

export const Modal = ({ isShown, children, title, onClose }) => {
  return (
    isShown &&
    createPortal(
      <Backdrop onClick={onClose}>
        <Container onClick={(e) => e.stopPropagation()}>
          <div className="title-container">
            <Title>{title}</Title>
            <Image
              alt={"close modal"}
              src="/cross.svg"
              height={30}
              width={30}
              onClick={onClose}
            />
          </div>
          {children}
        </Container>
      </Backdrop>,
      document.body
    )
  );
};
