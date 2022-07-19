import type { FC, PropsWithChildren } from "react";

const Footer: FC<PropsWithChildren> = (props) => {
  return (
    <footer className="p-8 grid place-items-center">
      <p className="text-center">{props.children}</p>
    </footer>
  );
};

export default Footer;
