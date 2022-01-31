import Head from "next/head";
import styled from "styled-components";
import { Header } from "../../layout/Header";
import { InputBar } from "./InputBar";

const Container = styled.main`
  min-height: 100vh;
  padding: 0px 48px;
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap: 48px;
`;

export const App = () => {
  return (
    <div>
      <Head>
        <title>Putty</title>
        <meta
          name="description"
          content="An option market to trade erc20 tokens and nfts"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <Header />
        <InputBar />
      </Container>
    </div>
  );
};
