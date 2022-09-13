import type { SVGProps } from "react";

const SvgChartIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" {...props}>
    <path
      d="M19.875 17.313H1.125V1.688"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m19.875 6.375-6.25 5.469-6.25-4.688-6.25 5.469"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgChartIcon;
