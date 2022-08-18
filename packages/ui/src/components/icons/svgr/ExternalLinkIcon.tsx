import type { SVGProps } from "react";

const SvgExternalLinkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" {...props}>
    <path
      d="M11 13H1a1.001 1.001 0 0 1-1-1V2a1.001 1.001 0 0 1 1-1h5v1H1v10h10V7h1v5a1.001 1.001 0 0 1-1 1Z"
      fill="#F8F9FC"
    />
    <path d="M8 0v1h3.293L7 5.293 7.707 6 12 1.707V5h1V0H8Z" fill="#F8F9FC" />
  </svg>
);

export default SvgExternalLinkIcon;
