module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./apps/*/tsconfig.json", "./packages/*/tsconfig.json"],
  },
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "^_.*$",
        argsIgnorePattern: "^_.*$",
      },
    ],
  },
  ignorePatterns: [
    ".next/",
    ".turbo/",
    "dist/",
    "build/",
    "packages/evm/src/generated/",
    "packages/proto-types/cosmos/",
    "packages/proto-types/gogoproto/",
    "packages/proto-types/google/",
    "packages/proto-types/sifnode/",
    "packages/proto-types/src/",
    "packages/sif-api/src/generated/",
  ],
};
