#!/bin/bash
# Builds the web app into dist/ (used locally and by GitHub Actions)
set -e
cd "$(dirname "$0")/.."
VER=$(cat VERSION); BUILD="$VER-$(date -u +%Y%m%d%H%M%S)"
rm -rf dist build; mkdir -p dist build
cat src/p0_icons.jsx src/p00_fonts.jsx src/p1_core.jsx src/p2_ui.jsx src/p2b_holo.jsx src/c0_engine.jsx src/c1_theory.jsx src/c2_singer.jsx src/c3_keys.jsx src/c4_guitar.jsx src/c5_bass_drums.jsx src/c6_sound.jsx src/c7_heart.jsx src/p3_data.jsx src/p4_singers.jsx src/p4b_singer_tools.jsx src/p5_musicians.jsx src/p5b_musician_tools.jsx src/p6_sound.jsx src/p6b_audio_tools.jsx src/p6c_console.jsx src/p7a_keep.jsx src/p7b_screens.jsx src/p7c_games_intro.jsx src/p7d_groups.jsx src/p7e_songs.jsx src/p7f_reminders.jsx src/p8a_cloud.jsx src/p8_app.jsx  | sed 's#"../assets/emoji.json"#"../public/assets/emoji.json"#' > build/App.jsx
cat > build/entry.jsx <<'X'
import React from "react"; import { createRoot } from "react-dom/client"; import App from "./App.jsx";
createRoot(document.getElementById("root")).render(<App />);
X
npx esbuild build/entry.jsx --bundle --minify --define:process.env.NODE_ENV='"production"' --define:__BEZA_BUILD__="\"$BUILD\"" --define:__BEZA_BUILD_NAME__="\"$VER\"" --jsx=automatic --outfile=dist/app.js --log-level=warning --loader:.json=json
cp -r public/. dist/
cp web/sw.js web/manifest.webmanifest dist/
node scripts/stamp.js "$BUILD" "$VER"
touch dist/.nojekyll
echo "built $BUILD"
