import type { SVGProps } from "react";

const SvgPencilIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 18 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      d="M17.75 15.25H.25v1.25h17.5v-1.25ZM14.875 4.625c.5-.5.5-1.25 0-1.75l-2.25-2.25c-.5-.5-1.25-.5-1.75 0L1.5 10v4h4l9.375-9.375ZM11.75 1.5 14 3.75l-1.875 1.875-2.25-2.25L11.75 1.5Zm-9 11.25V10.5L9 4.25l2.25 2.25L5 12.75H2.75Z"
      fill="#fff"
    />
  </svg>
);

export default SvgPencilIcon;
