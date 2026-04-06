// Required to prevent Next.js 15 static export from crashing on /404 prerender.
// Next.js `output: "export"` triggers an /_error prerender that imports <Html>
// from next/document. Without this file, the build fails with:
// "Error: <Html> should not be imported outside of pages/_document"
// This file is intentionally minimal — all routing uses App Router (app/).
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
