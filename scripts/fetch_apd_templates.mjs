import fs from "fs";
import path from "path";

const BASE_URL = "https://www.autopindesign.com";
const outDir = path.resolve("./.temp_apd");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function get(url) {
  const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
  console.log("Fetching:", fullUrl);
  const res = await fetch(fullUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${fullUrl}`);
  return await res.text();
}

async function main() {
  const html = await get("/app/");
  fs.writeFileSync(path.join(outDir, "index.html"), html, "utf8");

  // Find all script and modulepreload links
  const scriptRegex = /href=["']([^"']+\.js)["']|src=["']([^"']+\.js)["']/g;
  let match;
  const jsFiles = new Set();
  while ((match = scriptRegex.exec(html)) !== null) {
    jsFiles.add(match[1] || match[2]);
  }

  console.log("Found initial scripts in HTML:", Array.from(jsFiles));

  for (const jsFile of jsFiles) {
    try {
      const content = await get(jsFile);
      const filename = path.basename(jsFile);
      fs.writeFileSync(path.join(outDir, filename), content, "utf8");
      console.log(`Saved ${filename} (${content.length} bytes)`);

      // Find more chunks referenced inside this JS
      const chunkRegex = /["'](\/assets\/[^"']+\.js)["']|["'](\/?[a-zA-Z0-9_\-\.\/]+-[a-zA-Z0-9_\-]{8}\.js)["']/g;
      let chunkMatch;
      while ((chunkMatch = chunkRegex.exec(content)) !== null) {
        let chunk = chunkMatch[1] || chunkMatch[2];
        if (chunk && chunk.includes(".js") && !chunk.startsWith("http")) {
          if (!chunk.startsWith("/")) chunk = "/assets/" + chunk;
          if (!jsFiles.has(chunk)) {
            jsFiles.add(chunk);
            console.log("Found referenced chunk:", chunk);
          }
        }
      }
    } catch (e) {
      console.error("Failed fetching", jsFile, e.message);
    }
  }

  // Iterate over any newly added chunks
  for (const jsFile of Array.from(jsFiles)) {
    const filename = path.basename(jsFile);
    const localPath = path.join(outDir, filename);
    if (!fs.existsSync(localPath)) {
      try {
        const content = await get(jsFile);
        fs.writeFileSync(localPath, content, "utf8");
        console.log(`Saved dynamic chunk ${filename} (${content.length} bytes)`);
      } catch (e) {
        console.error("Failed dynamic chunk", jsFile, e.message);
      }
    }
  }

  console.log("Download complete. Analyzing files in", outDir);
}

main().catch(console.error);
