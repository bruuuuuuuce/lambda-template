# Lambda Template

This repo contains opinionated boilerplate code for building and bundling multiple lambdas from
a single `src` directory, without needing to nest multiple build files. Esbuild is used to
minify and optimize the lambda bundle to reduce cold starts and optmize runtimes.

To build the lambdas inside this repository, you can just run
`npm run build`

This will create a `dist` directory with the following structure
```bash
dist
├── products
│   ├── handler.js
│   ├── handler.js.map
│   └── products.zip
└── users
    ├── handler.js
    ├── handler.js.map
    └── users.zip
```

This `*.zip` files can be uploaded as lambda assets through cdk, serverless, cloud formation... to a
lambda with entrypoints `handler.handler`

To add a new lambda, a new folder under the `src` directory needs to be created, with a file `handler.ts`.
This file gets bundled by `esbuild` as the entrypoint to the lambda function

Any code that needs to be shared across multiple lambdas can go into the `common` folder. This folder is
unique in the sense that it is the older folder directly under `src` that does not get builded
into its own lambda.
