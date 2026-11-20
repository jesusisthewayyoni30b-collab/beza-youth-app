# Beza Youth Worship Team

Training app for the Beza International Church youth worship team: singers, musicians and sound.

- **Website:** https://beza-youth.web.app
- **Android:** [Download BezaYouth.apk](https://beza-youth.web.app/download)
- **iPhone:** open the website in Safari → Share → Add to Home Screen

Every push to `main` rebuilds the website and the APK automatically (see `.github/workflows/build.yml`).

## Releasing an update
1. Change the app in `src/`.
2. Bump `VERSION` and write the "What's new" lines in `NOTES.txt`.
3. Push. Everyone sees **Update required** next time they open the app.

Only bump `minShell` in `release.json` (and `BezaShell/N` in `capacitor.config.json`) when the Android app itself must be reinstalled.
