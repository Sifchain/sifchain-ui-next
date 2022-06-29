import { useState, memo } from "react";

export type ImageDecoding = "auto" | "sync" | "async";

export type AsyncImageProps = Omit<
  JSX.IntrinsicElements["img"],
  "placeholder"
> & {
  placeholder?: JSX.Element;
};

export const AsyncImage = memo<AsyncImageProps>(function AsyncImage({
  loading = "lazy",
  decoding = "async",
  placeholder,
  ...props
}) {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading && placeholder) {
    return placeholder;
  }

  return (
    <img
      loading={loading}
      decoding={decoding}
      onLoadStart={() => setIsLoading(true)}
      onLoad={() => setIsLoading(false)}
      {...props}
    />
  );
});
