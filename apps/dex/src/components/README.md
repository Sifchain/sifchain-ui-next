# Components

Sample component patterns:

- Functional Component

```tsx
import type { FC, PropWithChildren } from "react";

export type Props = {
  onClick: ?(() => void);
};

const Button: FC<PropsWithChildren<Props>> = (props) => (
  <button className="rounded bg-slate-900 px-2 py-1.5 text-slate-100">
    {props.children}
  </button>
);

export default Button;
```

- Styled Component

```tsx
import tw from "tailwind-styled-components";

export const Button = tw.button`
    px-2 py-1.5 rounded bg-slate-900 text-slate-100
`;
```
