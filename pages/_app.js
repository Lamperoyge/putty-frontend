import { ThemeProvider } from "styled-components";
import { InjectedConnector } from "wagmi";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { WalletLinkConnector } from "wagmi/connectors/walletLink";
import { Provider } from "wagmi";
import { Container } from "../components/layout/Container";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import "../styles/globals.css";
import { defaultChains } from "wagmi";
import { chain } from "wagmi";
import { TokenListProvider } from "../context/TokenListContext";

// API key for Ethereum node
const infuraId = process.env.INFURA_ID;

// Chains for connectors to support
const chains = defaultChains;

// Set up connectors
const connectors = ({ chainId }) => {
  const rpcUrl =
    chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
    chain.mainnet.rpcUrls[0];
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
    }),
    new WalletConnectConnector({
      options: {
        infuraId,
        qrcode: true,
      },
    }),
    new WalletLinkConnector({
      options: {
        appName: "My wagmi app",
        jsonRpcUrl: `${rpcUrl}/${infuraId}`,
      },
    }),
  ];
};

function MyApp({ Component, pageProps }) {
  const theme = {
    primary: "#F72585",
    secondary: "#3A0CA3",
    tertiary: "#4895EF",
    grey: "#666666",
    lightGrey: "#c9c9c9",
  };

  return (
    <Provider connectors={connectors}>
      <TokenListProvider>
        <ThemeProvider theme={theme}>
          <Container>
            <Component {...pageProps} />
            <Footer />
          </Container>
        </ThemeProvider>
      </TokenListProvider>
    </Provider>
  );
}

export default MyApp;
