# Chrome Web Store Packaging Instructions

This guide explains how to package the NEXUS Alert extension for submission to the Chrome Web Store.

---

## What to Include

The Chrome Web Store package must include:
- `manifest.json`
- All JavaScript files (`background.js`, `popup.js`, `offscreen.js`, `onboarding.js`)
- All HTML files (`popup.html`, `offscreen.html`, `onboarding.html`)
- `icons/` folder (all icon files)
- `src/` folder (slotFilters.js module)

## What to Exclude

Do **NOT** include these in the submission package:
- `node_modules/` — development dependencies
- `backend/` — server-side Cloudflare Worker code
- `web/` — marketing website (deployed separately)
- `.git/` — version control files
- `.gitignore`, `.vercel/`, `.github/` — development config
- `tests/` — test files
- `vitest.config.js`, `package.json`, `package-lock.json` — dev tools
- `README.md`, `docs/`, `spec.html`, `spec-manus.html` — documentation
- `store-assets/` — submission assets (uploaded separately)
- `*.zip` — previous package files
- `leads.json`, `reddit_leads.py` — marketing/outreach files

---

## Automatic Packaging Script

Use the provided script to create a clean package:

```bash
# Run from the project root
npm run package
```

This will create `nexus-alert-submission.zip` with only the necessary files.

---

## Manual Packaging Instructions

If you need to package manually:

### macOS / Linux

```bash
# Navigate to project root
cd /path/to/nexus-alert

# Create a clean temporary directory
mkdir -p /tmp/nexus-alert-package
rsync -av --exclude-from=.zipignore . /tmp/nexus-alert-package/

# Create the zip file
cd /tmp/nexus-alert-package
zip -r ~/Desktop/nexus-alert-submission.zip . -x "*.DS_Store" "*.git*"

# Clean up
rm -rf /tmp/nexus-alert-package

echo "Package created: ~/Desktop/nexus-alert-submission.zip"
```

### Windows (PowerShell)

```powershell
# Navigate to project root
cd C:\path\to\nexus-alert

# Create a temporary directory
New-Item -ItemType Directory -Force -Path $env:TEMP\nexus-alert-package

# Copy only the necessary files
Copy-Item manifest.json $env:TEMP\nexus-alert-package\
Copy-Item background.js $env:TEMP\nexus-alert-package\
Copy-Item popup.html $env:TEMP\nexus-alert-package\
Copy-Item popup.js $env:TEMP\nexus-alert-package\
Copy-Item offscreen.html $env:TEMP\nexus-alert-package\
Copy-Item offscreen.js $env:TEMP\nexus-alert-package\
Copy-Item onboarding.html $env:TEMP\nexus-alert-package\
Copy-Item onboarding.js $env:TEMP\nexus-alert-package\
Copy-Item -Recurse icons $env:TEMP\nexus-alert-package\
Copy-Item -Recurse src $env:TEMP\nexus-alert-package\

# Create the zip
Compress-Archive -Path $env:TEMP\nexus-alert-package\* -DestinationPath $env:USERPROFILE\Desktop\nexus-alert-submission.zip -Force

# Clean up
Remove-Item -Recurse -Force $env:TEMP\nexus-alert-package

Write-Host "Package created: $env:USERPROFILE\Desktop\nexus-alert-submission.zip"
```

---

## File List Verification

After packaging, verify the zip contains **exactly** these files:

```
nexus-alert-submission.zip
├── manifest.json
├── background.js
├── popup.html
├── popup.js
├── offscreen.html
├── offscreen.js
├── onboarding.html
├── onboarding.js
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   └── icon.svg
└── src/
    └── slotFilters.js
```

Total file count: **13 files** (9 root files + 4 icon files)

---

## Size Limits

- **Maximum package size:** 100 MB (we're well under — expect ~50 KB)
- **Individual file size:** No limit, but keep reasonable

---

## Pre-Submission Checklist

Before uploading to Chrome Web Store:

- [ ] Package only includes necessary files
- [ ] No `node_modules/` or backend code
- [ ] No sensitive data (API keys, secrets)
- [ ] Manifest version is updated (currently 2.0.0)
- [ ] Icons are included (16, 48, 128 px)
- [ ] All file paths in manifest are correct
- [ ] Extension loads without errors in `chrome://extensions`
- [ ] Test the packaged zip by loading it as unpacked
- [ ] File size is under 100 MB

---

## Testing the Package

Before submitting, test that the package works:

1. Unzip `nexus-alert-submission.zip` to a test folder
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the unzipped folder
6. Verify the extension loads without errors
7. Test all core functionality:
   - [ ] Popup opens and displays correctly
   - [ ] Status shows "Monitoring"
   - [ ] Can select locations
   - [ ] "Check Now" button works
   - [ ] Settings save properly
   - [ ] Onboarding flow works

---

## Upload to Chrome Web Store

Once the package is ready:

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Sign in with your Google account
3. Pay the **$5 one-time developer registration fee** (if first submission)
4. Click **New Item**
5. Upload `nexus-alert-submission.zip`
6. Fill in the listing details (see SUBMISSION-CHECKLIST.md)
7. Upload screenshots and promotional images
8. Submit for review

---

## Version Updates

When submitting an update:

1. Update the version in `manifest.json`:
   ```json
   "version": "2.1.0"
   ```

2. Re-package the extension

3. Upload to the Chrome Web Store Developer Dashboard

4. Describe changes in the "What's New" section

---

## Common Packaging Errors

### Error: "Package contains disallowed files"
**Fix:** Remove `node_modules/`, `.git/`, and other dev files

### Error: "Manifest file is invalid"
**Fix:** Validate `manifest.json` at https://jsonlint.com/

### Error: "Package exceeds size limit"
**Fix:** Remove large assets or compress images

### Error: "Icons missing or incorrect size"
**Fix:** Ensure icons/ folder contains 16, 48, 128 px PNGs

---

## Automated Package Script

Add this to `package.json`:

```json
{
  "scripts": {
    "package": "node scripts/package.js"
  }
}
```

Create `scripts/package.js`:

```javascript
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const output = fs.createWriteStream('nexus-alert-submission.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

archive.pipe(output);

// Add files
archive.file('manifest.json', { name: 'manifest.json' });
archive.file('background.js', { name: 'background.js' });
archive.file('popup.html', { name: 'popup.html' });
archive.file('popup.js', { name: 'popup.js' });
archive.file('offscreen.html', { name: 'offscreen.html' });
archive.file('offscreen.js', { name: 'offscreen.js' });
archive.file('onboarding.html', { name: 'onboarding.html' });
archive.file('onboarding.js', { name: 'onboarding.js' });

// Add directories
archive.directory('icons/', 'icons');
archive.directory('src/', 'src');

archive.finalize();

output.on('close', () => {
  console.log(`✓ Package created: nexus-alert-submission.zip (${archive.pointer()} bytes)`);
});
```

Install archiver: `npm install --save-dev archiver`
