import clsx from "clsx";
import React, { useState, useLayoutEffect, useCallback } from "react";

export type ImageDecoding = "auto" | "sync" | "async";

export type AsyncImageProps = {
  src: string;
  alt?: string;
  decoding?: ImageDecoding;
  className?: string;
  loadingClassName?: string;
  placeholder?: React.ReactElement;
  onLoad?: () => void;
};

function useStatus(src: string) {
  const [loaded, setLoaded] = useState<boolean | null>(null);
  useLayoutEffect(() => () => setLoaded(null), [src]);

  const onLoad = useCallback(() => setLoaded(true), []);
  const onError = useCallback(() => setLoaded(false), []);

  return [loaded === null, loaded === false, onLoad, onError] as const;
}

export const AsyncImage = React.memo<AsyncImageProps>(function AsyncImage({
  src,
  alt,
  placeholder,
  decoding = "async",
  className,
  loadingClassName = "",
  ...props
}) {
  const [fetching, error, onLoad, onError] = useStatus(src);

  if (error && placeholder) {
    return placeholder;
  }

  const imgProps = { alt, src, decoding, onError };

  return (
    <img
      {...imgProps}
      onLoad={() => {
        onLoad();
        if (props.onLoad) {
          props.onLoad();
        }
      }}
      loading="lazy"
      className={clsx(className, { [loadingClassName]: fetching })}
    />
  );
});
