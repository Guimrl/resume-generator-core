const fs = require("node:fs");
const path = require("node:path");

const assets = [
  {
    from: path.resolve(
      __dirname,
      "..",
      "src",
      "core",
      "templates",
      "principal-cv",
      "style.css"
    ),
    to: path.resolve(
      __dirname,
      "..",
      "dist",
      "src",
      "core",
      "templates",
      "principal-cv",
      "style.css"
    )
  }
];

for (const asset of assets) {
  fs.mkdirSync(path.dirname(asset.to), { recursive: true });
  fs.copyFileSync(asset.from, asset.to);
}
