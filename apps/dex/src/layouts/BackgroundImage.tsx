import tw from "tailwind-styled-components";

const OPACITY_VARIANTS = {
  10: "opacity-10",
  20: "opacity-20",
  30: "opacity-30",
  40: "opacity-40",
  50: "opacity-50",
  60: "opacity-60",
  70: "opacity-70",
  80: "opacity-80",
  90: "opacity-90",
  100: "opacity-100",
};

export type BgOpacityLevel = keyof typeof OPACITY_VARIANTS;

const Background = tw.figure<{ $opacity?: BgOpacityLevel }>`
  absolute inset-0 z-0 
  bg-forest bg-cover bg-center
  pointer-events-none
  ${({ $opacity }) => $opacity && OPACITY_VARIANTS[$opacity]}
`;

export default Background;
