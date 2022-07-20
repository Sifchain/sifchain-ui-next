import { SurfaceA } from "@sifchain/ui";
import tw from "tailwind-styled-components";

export const CardsGrid = tw.ul`grid gap-2 lg:gap-3 2xl:gap-4 md:grid-cols-2 xl:grid-cols-3 6xl:grid-cols-4`;

export const GridCard = tw(
  SurfaceA,
)`min-h-[120px] grid gap-4 max-w-[calc(100vw-1rem)]`;
