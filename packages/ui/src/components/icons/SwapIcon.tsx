import type { SVGProps } from "react";

const SvgSwapIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 18 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      d="M13.063 13.125V.812h.624V13.88l.534-.533 2.029-2.03.433.434-3.308 3.308-3.308-3.308.433-.433 2.029 2.029.534.533v-.754Z"
      fill="#CFD3DD"
      stroke="#CFD3DD"
      strokeWidth={0.625}
    />
    <path
      d="M4.625.5.875 4.25l.875.875L4 2.875V15.5h1.25V2.875l2.25 2.25.875-.875L4.625.5Z"
      fill="#CFD3DD"
    />
  </svg>
);

export default SvgSwapIcon;
