import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";
import ts from "typescript";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    {
      name: "chase-readable-output",
      async renderChunk(code) {
        const result = await transformWithEsbuild(code, "chase-bundle.js", {
          loader: "js",
          target: "es2020",
          legalComments: "none",
          minify: false,
        });
        const chaseSource = ts.createSourceFile(
          "chase-bundle.js",
          result.code,
          ts.ScriptTarget.Latest,
          true,
          ts.ScriptKind.JS,
        );
        const chasePrinter = ts.createPrinter({ removeComments: true });
        return { code: chasePrinter.printFile(chaseSource), map: null };
      },
      generateBundle: {
        order: "post",
        handler(_options, bundle) {
          for (const chaseOutput of Object.values(bundle)) {
            if (chaseOutput.type === "chunk") {
              chaseOutput.code = chaseOutput.code.replace(
                /\/\*\s*[@#]__PURE__\s*\*\//g,
                "",
              );
            }
          }
        },
      },
    },
  ],
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: "chase-remove-css-comments",
          Once(root) {
            root.walkComments((comment) => {
              comment.remove();
            });
          },
        },
      ],
    },
  },
  build: {
    outDir: "../web",
    emptyOutDir: true,
    sourcemap: false,
    minify: false,
    cssMinify: false,
    target: "es2020",
    cssTarget: "chrome103",
  },
});
