import {copyFile, mkdir, readFile, writeFile} from "node:fs/promises";
const entries = [["/","index.html","text/html"],["/app.js","app.js","text/javascript"],["/style.css","style.css","text/css"]];
const assets = Object.fromEntries(await Promise.all(entries.map(async ([route,file,type]) =>
  [route,{content:await readFile("web/"+file,"utf8"),type:type+"; charset=utf-8"}])));
await mkdir("dist/server",{recursive:true});
await mkdir("dist/.openai",{recursive:true});
await writeFile("dist/server/index.js", (await readFile("worker/index.mjs","utf8"))+"\nexport default makeWorker("+JSON.stringify(assets)+");\n");
await copyFile(".openai/hosting.json","dist/.openai/hosting.json");
