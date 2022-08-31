import type { SVGProps } from "react";

const SvgInfoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="1em" height="1em" {...props}>
    <path
      d="M64 6C32 6 6 32 6 64s26 58 58 58 58-26 58-58S96 6 64 6zm0 6c28.7 0 52 23.3 52 52s-23.3 52-52 52-52-23.3-52-52 23.3-52 52-52zm0 18a9 9 0 0 0 0 18 9 9 0 0 0 0-18zm0 29c-5 0-9 4-9 9v24c0 5 4 9 9 9s9-4 9-9V68c0-5-4-9-9-9z"
      shapeRendering="geometricPrecision"
    />
  </svg>
);

export default SvgInfoIcon;
