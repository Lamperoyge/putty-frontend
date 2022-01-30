import { ThemeProvider } from "styled-components";
import { Container } from "../components/layout/Container";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const theme = {
    primary: "#F72585",
    secondary: "#3A0CA3",
    tertiary: "#4895EF",
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        {/* <Header /> */}
        <Component {...pageProps} />
        <Footer />
      </Container>
    </ThemeProvider>
  );
}

export default MyApp;
