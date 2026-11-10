Hm Book - Updated Build

Files included:
- index.html
- manifest.webmanifest
- sw.js
- icon-192.png
- icon-512.png
- icon-maskable-512.png

Deployment:
1. Extract this ZIP.
2. Replace the existing GitHub Pages app files with these files in the same folder.
3. Commit/push the update.
4. Open the app online once so the updated service worker can install the new version.
5. If the old screen remains, fully close the installed app and reopen it after the update has loaded.

Existing customer data uses the same local storage key and is not intentionally reset by this update. Take a Full Backup before replacing the deployed files as a precaution.

Security notes:
- PIN and biometric locks are optional and configured in Settings.
- Biometric setup requires HTTPS and a compatible browser/device authenticator. The phone may request fingerprint, face, or its screen-lock PIN depending on device support.
- The app continues to store business records locally in browser storage; the optional lock is an access barrier, not encryption of the stored records.
