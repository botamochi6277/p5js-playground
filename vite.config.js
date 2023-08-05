// https://chaika.hatenablog.com/entry/2022/12/08/083000
import { defineConfig } from 'vite';

export default defineConfig({
  // index.html の場所
  root: 'p5js-playground',
  // アセットなどのパスを変換するベースとなるパス
  // `/foo/` とすると `/foo/` 始まりのパスに変換される
  base: process.env.GITHUB_PAGES  // この行を追加
    ? "p5js-playground"            // この行を追加
    : "./",                     // この行を追加
  // 静的ファイルの場所
  //  `public` を指定した場合 `<root>/public` が静的ファイルの格納場所になる
  publicDir: 'public',
  build: {
    // `root` からの相対パスで指定する
    outDir: '../dist',
  },
  envDir: '../',
});