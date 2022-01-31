import Image from "next/image";
import { useEffect } from "react";
import styled from "styled-components";
import { Title } from "../core/Title";

const Container = styled.div`
  position: fixed;
  background: white;
  borde-radius: 6px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: fit-content;
  height: fit-content;
  padding: 12px;
  box-shadow: 0px 0px 19px 6px rgba(0, 0, 0, 0.18);
  max-width: 100%;

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

export const Modal = ({ isShown, children, title, onClose }) => {
  useEffect(() => {
    if (isShown) {
      document.addEventListener("click", onClose);
      return () => document.removeEventListener("click", onClose);
    }
  }, [isShown]);

  return (
    isShown && (
      <Container onClick={(e) => e.stopPropagation()}>
        <div className="title-container">
          <Title>{title}</Title>
          <Image src="/cross.svg" height={30} width={30} onClick={onClose} />
        </div>
        {children}
      </Container>
    )
  );
};
