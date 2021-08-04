import React, { useEffect } from "react";

import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { darkTheme, lightTheme } from "lib/theme";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Remove the server side injected CSS
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
