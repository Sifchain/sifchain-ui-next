import type { FC } from "react";
import {
  toast as _toast,
  ToastContainer as _ToastContainer,
} from "react-toastify";

import {
  XIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/outline";

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

export const api: Partial<typeof _toast> = {
  info(content, options) {
    return _toast.info(content, {
      icon: (
        <InformationCircleIcon className="absolute h-6 w-6 -top-3 -left-2 text-brand" />
      ),
      ...options,
    });
  },
  warn(content, options) {
    return _toast.warn(content, {
      icon: (
        <ExclamationCircleIcon className="absolute h-6 w-6 -top-3 -left-2 text-yellow-400" />
      ),
      ...options,
    });
  },
  success(content, options) {
    return _toast.success(content, {
      icon: (
        <CheckCircleIcon className="absolute h-6 w-6 -top-3 -left-2 text-highlight" />
      ),
      ...options,
    });
  },
  error(content, options) {
    return _toast.error(content, {
      icon: (
        <XCircleIcon className="absolute h-6 w-6 -top-3 -left-2 text-assertive" />
      ),
      ...options,
    });
  },
};

export default api;

export const ToastContainer = _ToastContainer;

ToastContainer.defaultProps = {
  position: "top-right",
  closeButton: <XIcon className="absolute top-2 right-2 h-5 w-5 text-muted" />,
  toastClassName:
    "border-2 rounded-xl bg-dark text-white text-sm border-dimmed p-2 px-4 font-semibold relative",
  hideProgressBar: true,
  limit: 4,
};
