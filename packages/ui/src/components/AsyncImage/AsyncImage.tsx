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
  className = "async-image",
  loadingClassName = "async-image-loading",
}) {
  const [fetching, error, onLoad, onError] = useStatus(src);

  if (error && placeholder) {
    return placeholder;
  }

  const props = { alt, src, decoding, onLoad, onError };

  return (
    <img
      {...props}
      className={clsx(className, { [loadingClassName]: fetching })}
    />
  );
});
