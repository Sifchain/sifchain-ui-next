import type { SVGProps } from "react";

const SvgBalanceIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" {...props}>
    <path
      d="M9 6.188A2.812 2.812 0 1 0 11.813 9 2.815 2.815 0 0 0 9 6.187Zm0 6.25A3.438 3.438 0 1 1 9 5.56a3.438 3.438 0 0 1 0 6.877Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={0.625}
    />
    <path
      d="M9 14.938a5.949 5.949 0 0 1-4.21-1.752l.465-.417a5.314 5.314 0 0 0 8.203-6.659 5.313 5.313 0 0 0-4.146-2.413V3.07A5.937 5.937 0 0 1 9 14.938Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={0.625}
    />
    <path
      d="M9 17.75A8.75 8.75 0 1 1 17.75 9 8.76 8.76 0 0 1 9 17.75ZM9 1.5A7.5 7.5 0 1 0 16.5 9 7.509 7.509 0 0 0 9 1.5Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgBalanceIcon;
