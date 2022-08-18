import type { SVGProps } from "react";

const SvgQrcodeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" {...props}>
    <path
      d="M11 12v1h1v-1h-1ZM8 10v1h1v-1H8ZM8 14h2v-1H9v-1H8v2ZM12 10v2h1v-2h-1ZM13 12h1v2h-2v-1h1v-1ZM12 9V8h2v2h-1V9h-1ZM11 9h-1v2H9v1h2V9ZM8 8v1h2V8H8ZM4 10H2v2h2v-2Z"
      fill="#EDEFF5"
    />
    <path d="M6 14H0V8h6v6Zm-5-1h4V9H1v4ZM12 2h-2v2h2V2Z" fill="#EDEFF5" />
    <path d="M14 6H8V0h6v6ZM9 5h4V1H9v4ZM4 2H2v2h2V2Z" fill="#EDEFF5" />
    <path d="M6 6H0V0h6v6ZM1 5h4V1H1v4Z" fill="#EDEFF5" />
  </svg>
);

export default SvgQrcodeIcon;
