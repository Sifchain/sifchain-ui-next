import type { FC } from "react";

export { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.min.css";

type ToastContentProps = {
  title: string;
  body?: string;
};

export const ToastContent: FC<ToastContentProps> = (props) => {
  return (
    <div className="grid gap-2">
      <div className="font-semibold">{props.title}</div>
      {props.body && <div className="text-muted">{props.body}</div>}
    </div>
  );
};
