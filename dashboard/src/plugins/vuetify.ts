import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { createVuetify } from "vuetify";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import colors from "vuetify/lib/util/colors";

export default createVuetify({
  theme: {
    defaultTheme: "dark",
  },
  display: {
    mobileBreakpoint: "md",
  },
});
