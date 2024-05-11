// pages/_app.tsx
import Head from "next/head";
import { AppProps } from "next/app";

function CastSenseApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="CastSense" />
        <meta property="og:description" content="Made by 0xshash" />
        <meta
          property="og:image"
          content="https://www.castsense.xyz/castsense-dwr.png"
        />
        <meta property="og:type" content="website" />
        <title>CastSense</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default CastSenseApp;
