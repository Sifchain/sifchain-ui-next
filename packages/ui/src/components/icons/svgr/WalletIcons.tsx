import type { SVGProps } from "react";

const SvgWalletIcons = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 18 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      d="M16.5 4h-15V2.125h13.75V.875H1.5a1.25 1.25 0 0 0-1.25 1.25V15.25A1.25 1.25 0 0 0 1.5 16.5h15a1.25 1.25 0 0 0 1.25-1.25v-10A1.25 1.25 0 0 0 16.5 4Zm-15 11.25v-10h15v1.875h-5a1.25 1.25 0 0 0-1.25 1.25v3.75a1.25 1.25 0 0 0 1.25 1.25h5v1.875h-15Zm15-6.875v3.75h-5v-3.75h5Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgWalletIcons;
