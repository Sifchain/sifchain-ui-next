import { forwardRef } from "react";
import tw from "tailwind-styled-components";

export const StyledInput = tw.input`
  border-gray-700 bg-gray-750 text-gray-50 rounded-xl opacity-90 outline-none p-2 px-4
  placeholder:text-gray-300
  focus:ring focus:ring-blue-400/40
  hover:opacity-100
`;

export type InputProps = Omit<JSX.IntrinsicElements["input"], "ref"> & {
  label?: string;
  children?: React.ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, children, ...props }, ref) => (
    <label className="relative">
      {label && <span className="sr-only">{label}</span>}
      <StyledInput aria-label={label} {...props} ref={ref} />
      {children}
    </label>
  ),
);
