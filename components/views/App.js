import Head from "next/head";
import styled from "styled-components";
import { Header } from "../layout/Header";

const Container = styled.main`
  min-height: 100vh;
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
        <div>market stuff</div>
      </Container>
    </div>
  );
};
