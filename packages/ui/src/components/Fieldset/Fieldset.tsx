import { forwardRef } from "react";
import tw from "tailwind-styled-components";

const StyledWrapper = tw.fieldset`
  bg-gray-900 p-6 rounded-lg
`;

export type FieldsetProps = Omit<JSX.IntrinsicElements["fieldset"], "ref"> & {
  label?: string;
};

export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(
  ({ label, children, ...props }, ref) => {
    return (
      <StyledWrapper {...props} ref={ref}>
        {label && (
          <legend className="block translate-y-10 pb-6 font-semibold text-gray-200">
            {label}
          </legend>
        )}
        {children}
      </StyledWrapper>
    );
  }
);
