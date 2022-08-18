import type { SVGProps } from "react";

const SvgKeplrIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" {...props}>
    <defs>
      <radialGradient
        cx="90.867%"
        cy="10.959%"
        fx="90.867%"
        fy="10.959%"
        r="172.001%"
        gradientTransform="rotate(140.172 .913 .12) scale(1 1.20673)"
        id="keplr-icon_svg__a"
      >
        <stop stopColor="#2F80F2" offset="0%" />
        <stop stopColor="#A942B5" offset="99.966%" />
      </radialGradient>
      <radialGradient
        cx="0%"
        cy="2.148%"
        fx="0%"
        fy="2.148%"
        r="159.108%"
        gradientTransform="rotate(46.321 .001 .022) scale(1 1.04786)"
        id="keplr-icon_svg__b"
      >
        <stop stopColor="#45F9DE" offset="0%" />
        <stop stopColor="#A942B5" stopOpacity={0} offset="100%" />
      </radialGradient>
      <radialGradient
        cx="100%"
        cy="100%"
        fx="100%"
        fy="100%"
        r="96.044%"
        gradientTransform="matrix(-1 0 0 -.51496 2 1.515)"
        id="keplr-icon_svg__c"
      >
        <stop stopColor="#E957C5" offset="0%" />
        <stop stopColor="#AC43B6" stopOpacity={0.044} offset="100%" />
        <stop stopColor="#A942B5" stopOpacity={0} offset="100%" />
      </radialGradient>
      <radialGradient
        cx="50%"
        cy="50%"
        fx="50%"
        fy="50%"
        r="57.652%"
        gradientTransform="rotate(119.938 .572 .625) scale(1 1.49919)"
        id="keplr-icon_svg__d"
      >
        <stop stopOpacity={0.185} offset="0%" />
        <stop stopColor="#101010" offset="100%" />
      </radialGradient>
      <linearGradient x1="94.238%" y1="58.966%" x2="0%" y2="0%" id="keplr-icon_svg__e">
        <stop stopColor="#FFF" stopOpacity={0.185} offset="0%" />
        <stop stopColor="#FFF" offset="100%" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <rect fill="url(#keplr-icon_svg__a)" width={200} height={200} rx={16} />
      <rect fillOpacity={0.57} fill="url(#keplr-icon_svg__b)" width={200} height={200} rx={16} />
      <rect fillOpacity={0.68} fill="url(#keplr-icon_svg__c)" width={200} height={200} rx={16} />
      <rect fillOpacity={0.08} fill="url(#keplr-icon_svg__d)" width={200} height={200} rx={16} />
      <rect fillOpacity={0.03} fill="url(#keplr-icon_svg__e)" width={200} height={200} rx={16} />
      <path
        fill="#FFF"
        fillRule="nonzero"
        d="M70.4 170v-62l58.6 62h32.6v-1.6L94.2 97.8l62.2-67V30h-32.8L70.4 89.2V30H44v140z"
      />
    </g>
  </svg>
);

export default SvgKeplrIcon;
