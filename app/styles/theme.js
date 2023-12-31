import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "primary",
        color: "white",
      },
    },
  },
  colors: {
    primary: "#0D121D",
    secondary: "#121A29",
    green: "#25CE8F",
    red: "#F45353",
  },
  components: {
    Table: {
      baseStyle: {
        th: {
          textTransform: "none",
          fontWeight: "normal",
        },
      },
    },
  },
});

export default theme;
