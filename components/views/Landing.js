import Head from "next/head";
import { Title } from "../core/Title";
import styled from "styled-components";
import { Button } from "../core/Button";
import Link from "next/link";

const SubtitleContainer = styled.h3`
  font-weight: bold;
  font-size: 64px;
  margin: 0;
  padding: 48px;

  @media screen and (max-width: 600px) {
    padding: 24px;
    font-size: 48px;
  }
`;

const ColorGradientContainer = styled.div`
  width: 100%;
  padding-bottom: 24px;

  div {
    width: 100%;
    height: 48px;
  }
`;

const Container = styled.main`
  display: grid;
  row-gap: 48px;
  min-height: 100vh;

  .header {
    padding: 48px;
    display: flex;
    justify-content: space-between;
  }

  @media screen and (max-width: 600px) {
    .header {
      display: grid;
      padding: 24px;
      row-gap: 24px;
    }
  }
`;

export const Landing = () => {
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
        <div className="header">
          <Title>Putty</Title>

          <Link href="/app">
            <Button>Open App (Coming Soon)</Button>
          </Link>
        </div>

        <SubtitleContainer>
          Got NFTs? This is for you. Hedge your downside risk with put
          contracts.
        </SubtitleContainer>

        <ColorGradientContainer>
          {["#4CC9F0", "#4895EF", "#4361EE", "#3F37C9", "#3A0CA3"].map(
            (color) => (
              <div style={{ backgroundColor: color }} key={color} />
            )
          )}
        </ColorGradientContainer>
      </Container>
    </div>
  );
};
