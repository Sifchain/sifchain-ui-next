import type { SVGProps } from "react";

const SvgLockIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 14 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      d="M12 7.75h-1.25V4a3.75 3.75 0 0 0-7.5 0v3.75H2A1.25 1.25 0 0 0 .75 9v7.5A1.25 1.25 0 0 0 2 17.75h10a1.25 1.25 0 0 0 1.25-1.25V9A1.25 1.25 0 0 0 12 7.75ZM4.5 4a2.5 2.5 0 1 1 5 0v3.75h-5V4ZM12 16.5H2V9h10v7.5Z"
      fill="#9699A5"
    />
  </svg>
);

export default SvgLockIcon;
