import type { FC, PropsWithChildren } from "react";

const Footer: FC<PropsWithChildren> = (props) => {
  return (
    <footer className="grid place-items-center p-8">
      <p className="text-center">{props.children}</p>
    </footer>
  );
};

export default Footer;
