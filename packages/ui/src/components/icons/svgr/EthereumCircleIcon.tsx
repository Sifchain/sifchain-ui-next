import type { SVGProps } from "react";

const SvgEthereumCircleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" {...props}>
    <path d="M0 7a7 7 0 1 1 14 0A7 7 0 0 1 0 7Z" fill="#21242F" />
    <path d="m6.999 2-.067.228V8.84l.067.067 3.07-1.814L6.998 2Z" fill="#fff" />
    <path d="m6.999 2-3.07 5.093L7 8.907V2ZM6.999 9.488l-.038.046v2.356L7 12l3.071-4.325L7 9.488Z" fill="#fff" />
    <path d="M6.999 12V9.488l-3.07-1.813L7 12ZM6.999 8.907l3.07-1.814-3.07-1.395v3.209Z" fill="#fff" />
    <path d="m3.93 7.093 3.069 1.814v-3.21l-3.07 1.396Z" fill="#fff" />
  </svg>
);

export default SvgEthereumCircleIcon;
