import type { FC, PropsWithChildren } from "react";

const Header: FC<PropsWithChildren<{}>> = (props) => {
  return <header className="h-28 bg-slate-900">{props.children}</header>;
};

export default Header;
