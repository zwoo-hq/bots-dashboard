import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { createVuetify } from "vuetify";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import colors from "vuetify/lib/util/colors";

export default createVuetify({
  theme: {
    defaultTheme: "dark",
    themes: {
      light: {
        colors: {
          primary: "#3f8c00",
          secondary: colors.lightBlue.darken4,
          error: colors.red.darken1,
          success: colors.green.base,
        },
      },
      dark: {
        colors: {
          primary: "#3f8c00",
          secondary: colors.lightBlue.base,
          error: colors.red.lighten1,
        },
      },
    },
  },
  display: {
    mobileBreakpoint: "md",
  },
});
