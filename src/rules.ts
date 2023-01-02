import { WebpackOptionsNormalized } from "webpack";

export default (
  server,
  cssLoader = undefined
): WebpackOptionsNormalized["module"]["rules"] => [
  {
    test: /\.(png|jpe?g|gif)$/i,
    loader: "file-loader",
    options: {
      name: "[path][name].[ext]",
    },
  },
  {
    test: /\.css$/,
    use: [
      ...(cssLoader ? [cssLoader] : []),
      {
        loader: "css-loader",
        options: {
          importLoaders: 1,
          modules: {
            localIdentName: "[local]--[hash:base64:5]",
            exportOnlyLocals: server,
            exportLocalsConvention: "camelCase",
          },
        },
      },
      "postcss-loader",
    ],
  },
  {
    test: /\.(ts|js)x?$/,
    exclude: /node_modules/,
    use: {
      loader: "ts-loader",
      options: {
        compilerOptions: { noEmit: false },
        allowTsInNodeModules: true,
      },
    },
  },
];
