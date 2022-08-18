import type { SVGProps } from "react";

const SvgPlusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" {...props}>
    <path d="M6.125 4.375V0h-1.25v4.375H.5v1.25h4.375V10h1.25V5.625H10.5v-1.25H6.125Z" fill="#fff" />
  </svg>
);

export default SvgPlusIcon;
