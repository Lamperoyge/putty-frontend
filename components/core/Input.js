import styled from "styled-components";

export const Input = styled.input`
  border: 2px solid ${({ theme }) => theme.lightGrey};
  border-radius: 2px;
  font-size: inherit;
  font-family: inherit;
  padding: 12px;

  &:focus {
    outline: none;
    border: 2px solid black;
  }
`;
