import styled from "styled-components";

export const Button = styled.button`
  padding: 12px 24px;
  color: white;
  border: none;
  background-color: ${({ theme, secondary }) =>
    secondary ? theme.secondary : theme.primary};
  border-radius: 8px;
  font-size: inherit;
  height: fit-content;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }

  &:focus {
    outline: 2px solid black;
    outline-offset: 2px;
  }
`;
