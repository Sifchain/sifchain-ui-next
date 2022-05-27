#!/usr/bin/env zx

await $`rm -rf build`;

await Promise.all([
  $`pnpm tsc -w -m commonjs --outDir build/commonjs`,
  $`pnpm tsc -w -m esnext --outDir build/module`,
]);
