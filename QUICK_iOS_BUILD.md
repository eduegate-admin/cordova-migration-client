# 🚀 Quick Start: Run iOS App Without Expo

## TL;DR - Fast Version

### For Windows Users (No Mac Needed)

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo
eas login
# Opens browser to create free Expo account

# 3. In your project folder
eas build:configure

# 4. Build for iOS
eas build -p ios

# 5. Wait 10-15 minutes... ✅
# Get TestFlight link via email
```

Then on your **iPhone**:
1. Click TestFlight link
2. Tap "Accept" 
3. Tap "Install"
4. Done! 🎉

---

### For Mac Users (Fastest)

```bash
# 1. Install dependencies
brew install node cocoapods
npm install

# 2. Build for iOS
npm run ios

# 3. Opens simulator automatically ✅
```

Or run on real iPhone:
```bash
# Connect iPhone, run:
npm run ios -- --device iPhone
```

---

## Step-by-Step: EAS Build (Windows)

### Step 1: Create Expo Account

```bash
eas login
```

Opens browser → Sign up (free) → Returns to terminal

### Step 2: Configure Project

```bash
eas build:configure

? Platform: ios
? Build type: app archive
```

Creates `eas.json` file ✅

### Step 3: Start Build

```bash
eas build -p ios
```

Terminal output:
```
✨ Starting build...
📱 Building for iOS...
[████████████] 50% - Building...
✅ Build successful!

📲 Install via TestFlight: https://testflight.apple.com/...
```

### Step 4: Monitor Progress

```
Queued...
Preparing...
Building... (takes ~10 mins)
✅ Complete!
```

### Step 5: Get Your App

Check your email for **TestFlight invitation**

Or view builds:
```bash
eas build:list

# View specific build
eas build:view <BUILD_ID>
```

### Step 6: Install on iPhone

1. **From TestFlight Email**:
   - Click link
   - Open in TestFlight app
   - Tap "Accept" → "Install"

2. **Or Direct Download**:
   ```bash
   eas build:list
   # Find your build, download IPA
   # Airdrop to iPhone or use Xcode
   ```

---

## Build Commands Reference

```bash
# Preview build (for testing with internal distribution)
eas build -p ios --profile preview

# Production build (for App Store submission)
eas build -p ios --profile production

# View build history
eas build:list

# Download build artifact
eas build:download <BUILD_ID>

# Cancel running build
eas build:cancel <BUILD_ID>

# View build details
eas build:view <BUILD_ID>

# Full rebuild logs
eas build -p ios --verbose
```

---

## File Structure

```
your-project/
├── eas.json                    # EAS configuration
├── app.json                    # App configuration
├── package.json                # Dependencies
├── ios/                        # iOS native code
├── android/                    # Android native code
└── src/                        # Your code
```

---

## Troubleshooting

### "Command not found: eas"

```bash
# Solution: Install globally
npm install -g eas-cli
```

### "Not authenticated"

```bash
# Solution: Login again
eas login

# Or logout first
eas logout
eas login
```

### Build Fails

```bash
# Solution 1: Check build details
eas build:view <BUILD_ID>

# Solution 2: Rebuild with verbose logs
eas build -p ios --verbose

# Solution 3: Check dependencies
npm install
npm ci
```

### "Build still queued after 1 hour"

```bash
# Solution: Cancel and retry
eas build:cancel <BUILD_ID>
eas build -p ios
```

### TestFlight Link Expired

```bash
# Solution: Build again
eas build -p ios --profile preview
# Get new link
```

---

## What's Happening Behind Scenes

```
Your Computer
     ↓
  EAS Cloud
     ↓
Apple's Build Servers (macOS)
     ↓
Sign with Certificate
     ↓
Create IPA (app file)
     ↓
Upload to TestFlight
     ↓
Email Link to You
     ↓
Download on iPhone
```

**Result**: App on your iPhone without needing Mac! ✅

---

## After Testing

### Share with Team

```bash
# Get build link
eas build:list

# Share TestFlight URL
# Anyone can install from TestFlight!
```

### Submit to App Store

```bash
# After successful testing
eas submit -p ios

# Enter Apple credentials
# Auto-submits to App Store
```

---

## Config File (eas.json)

Already created! Located in project root.

**Development**: For testing with development client  
**Preview**: For TestFlight testing  
**Production**: For App Store

---

## Next Commands to Run

```bash
# If not already done:
npm install -g eas-cli
eas login

# Then build:
eas build -p ios

# Check status:
eas build:list

# Download when done:
eas build:download <BUILD_ID>
```

---

## Support

```bash
# Get help
eas --help
eas build --help

# EAS Docs
https://docs.expo.dev/eas/

# Common Issues
https://docs.expo.dev/eas/build/#troubleshooting
```

---

**Status**: Ready to build! 🎉  
**Platform**: Works on Windows/Mac/Linux  
**Estimated Time**: 15 minutes to first build  

Run: `eas build -p ios` → Get TestFlight link → Install on iPhone ✅
