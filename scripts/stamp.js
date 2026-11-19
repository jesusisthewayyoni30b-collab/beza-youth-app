// writes dist/version.json + dist/index.html for the mandatory-update check
const fs = require("fs");
const [build, name] = process.argv.slice(2);
const notes = fs.readFileSync("NOTES.txt", "utf8").split("\n").map((s) => s.trim()).filter(Boolean);
const rel = fs.existsSync("release.json") ? JSON.parse(fs.readFileSync("release.json", "utf8")) : {};
fs.writeFileSync("dist/version.json", JSON.stringify({ build, name, notes, minShell: rel.minShell || 1, apk: rel.apk || "" }, null, 1));
fs.writeFileSync("dist/index.html", fs.readFileSync("web/index.html", "utf8").replace(/__BUILD__/g, build));
