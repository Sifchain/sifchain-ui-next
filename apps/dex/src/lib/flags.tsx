export type FlagsState = {
  features: {
    margin: boolean;
  };
};

export type Features = keyof FlagsState["features"];

export function useFeatures() {
  const rawFeatures = process.env["NEXT_PUBLIC_FEATURES"] ?? "";
  return new Set<Features>(rawFeatures.split(/,(\s+)?/) as Features[]);
}

export function useFlag(key: Features) {
  const features = useFeatures();

  return features.has(key);
}
