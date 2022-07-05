import type { SVGProps } from "react";

const SvgSortDescending = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 8 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="m8 12-4 4-4-4h8ZM0 4l4-4 4 4H0Z" fill="#fff" />
  </svg>
);

export default SvgSortDescending;
