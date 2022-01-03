import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="pt-BR">
        <Head>
          <meta charset="UTF-8" />
          <meta name="description" content="Listen on Spotify" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="icon"
            sizes="32x32"
            type="image/png"
            href="https://open.scdn.co/cdn/images/favicon32.8e66b099.png"
          />
          <link
            rel="icon"
            sizes="16x16"
            type="image/png"
            href="https://open.scdn.co/cdn/images/favicon16.c498a969.png"
          />
          <title>Spotify Clone</title>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
