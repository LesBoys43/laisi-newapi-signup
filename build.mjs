import { rollup } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import replace from "@rollup/plugin-replace";
import path from "path";
import fs from "fs";
import less from "less";
import crypto from "crypto";

await fs.rm("build", { recursive: true, force: true }, console.error);

function fileHash(filePath) {
  const hash =
    BigInt(
      "0x" +
        crypto
          .createHash("sha256")
          .update(fs.readFileSync(filePath))
          .digest("hex"),
    ) %
    62n ** 12n;
  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "",
    n = hash;
  while (n > 0) {
    result = chars[Number(n % 62n)] + result;
    n /= 62n;
  }
  return result.padStart(12, "0");
}

const __dirname = path.dirname(new URL(import.meta.url).pathname);

let i = 0;

const bundle = await rollup({
  input: "src/index.ts",
  plugins: [
    typescript({ tsconfig: "./tsconfig.json" }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("devlopment"),
    }),
    nodeResolve(),
    commonjs(),
    terser({ module: true, mangle: { toplevel: true }, ecma: 5 }),
  ],
});

await bundle.write({
  dir: "build",
  format: "esm",
  entryFileNames: "[name].js",
  chunkFileNames: "[name].js",
  manualChunks(id) {
    let key;
    if (id.includes("node_modules")) key = "vendor";
    if (id.includes("src")) key = "app";
    return key + "." + fileHash(id);
  },
});

await bundle.close();

const lessContent = await fs.promises.readFile("src/app.less", "utf8");
const result = await less.render(lessContent, {
  filename: "src/app.less",
  paths: [path.dirname("src/app.less")],
});
await fs.promises.mkdir("build", { recursive: true });
await fs.promises.writeFile("build/index.css", result.css);
