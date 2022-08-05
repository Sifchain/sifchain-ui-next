import clsx from "clsx";
import { useState, memo } from "react";

export type ImageDecoding = "auto" | "sync" | "async";

export type AsyncImageProps = Omit<
  JSX.IntrinsicElements["img"],
  "placeholder"
> & {
  placeholder?: JSX.Element;
  containerClassName?: string;
};

export const AsyncImage = memo<AsyncImageProps>(function AsyncImage({
  loading = "lazy",
  decoding = "async",
  height = "100%",
  width = "100%",
  placeholder,
  className,
  containerClassName,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);

  const shouldRenderPlaceholder = Boolean(!loaded && placeholder);

  return (
    <picture
      style={{
        height: height,
        width: width,
      }}
      className={clsx(
        containerClassName,
        "relative grid place-items-center overflow-hidden",
      )}
    >
      {shouldRenderPlaceholder && <>{placeholder}</>}
      <img
        loading={loading}
        decoding={decoding}
        onLoad={setLoaded.bind(null, true)}
        className={clsx(
          "absolute object-cover transition-opacity duration-200",
          {
            "opacity-0": !loaded,
          },
          className,
        )}
        {...props}
      />
    </picture>
  );
});
