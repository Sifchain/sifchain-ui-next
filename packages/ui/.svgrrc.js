module.exports = {
  typescript: true,
  index: true,
  icon: true,
  ext: "tsx",
  jsxRuntime: "automatic",
  outDir: "./src/components/icons",
  template: (variables, { tpl }) => {
    return tpl`
import type { SVGProps } from "react";

${variables.interfaces};

const ${variables.componentName} = (${variables.props}) => (
${variables.jsx}
);

${variables.exports};
  `;
  },
};
