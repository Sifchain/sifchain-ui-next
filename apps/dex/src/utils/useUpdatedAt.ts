import { useEffect, useRef, useState } from "react";

const useUpdatedAt = <T>(value: T) => {
  const isFirstRender = useRef(true);
  const lastValue = useRef<T | null>(null);
  const [timestamp, setTimestamp] = useState(() => new Date());

  useEffect(() => {
    if (!isFirstRender.current && JSON.stringify(value) !== JSON.stringify(lastValue.current)) {
      setTimestamp(new Date());
      return;
    }

    isFirstRender.current = false;
  }, [value]);

  return timestamp;
};

export default useUpdatedAt;
