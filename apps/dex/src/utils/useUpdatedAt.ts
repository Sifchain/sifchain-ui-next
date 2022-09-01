import { useEffect, useRef, useState } from "react";

const useUpdatedAt = <T>(value: T) => {
  const isFirstRender = useRef(true);
  const [timestamp, setTimestamp] = useState(() => new Date());

  useEffect(() => {
    if (!isFirstRender.current) {
      setTimestamp(new Date());
    }

    isFirstRender.current = false;
  }, [value]);

  return timestamp;
};

export default useUpdatedAt;
