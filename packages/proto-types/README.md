# @sifchain/proto-types

JS and TS types relating to Protocol Buffers used by [SifNode](https://github.com/Sifchain/sifnode) and other related projects

## Dependencies

To generate JS/TS code from protocol buufers, you need to install:

- https://formulae.brew.sh/formula/protobuf#default

You can use Brew on macOS:

```
brew install protobuf
```

## Rebuilding types

```sh
pnpm syncProto # sync protobuf definition files from sifnode
pnpm codegen # generate .js/.d.ts files
```
