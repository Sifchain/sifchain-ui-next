import clsx from "clsx";

type SlugProps = {
  color: string;
  title: string;
};

export function Slug({ color, title }: SlugProps) {
  const clsn = clsx({
    "text-green-400": color === "green",
    "text-red-400": color === "red",
  });
  return <span className={clsn}>{title}</span>;
}
