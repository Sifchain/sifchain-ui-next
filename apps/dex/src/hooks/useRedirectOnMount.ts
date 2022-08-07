import { useRouter } from "next/router";
import { useEffect } from "react";

export function useRedirectOnMount(path: string, condition?: boolean) {
  const router = useRouter();
  useEffect(() => {
    if (condition) {
      router.push(path);
    }
  }, [condition, router, path]);
}
