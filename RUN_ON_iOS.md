# 📱 Run React Native App on iOS - Complete Guide

## ⚠️ Important: macOS Required

To run iOS apps, you **must be on macOS**. If you're on Windows, you have limited options:

### Windows Users - Options:

1. **Use Expo Go** (Easiest)
   ```bash
   npx expo start
   ```
   - Scan QR code on iPhone
   - Limited native features

2. **Use EAS Cloud Build** (Recommended)
   ```bash
   eas build -p ios
   ```
   - No Mac needed
   - Builds in cloud, then sends TestFlight link

3. **Get a Mac** (Best)
   - Run native builds locally
   - Full control and debugging

---

## Option 1: EAS Cloud Build (Best for Windows Users) ✅

### What is EAS?
EAS = Expo Application Services. Builds your app in the cloud on Apple's servers.

### Step 1: Sign Up for EAS

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to Expo
eas login
# Opens browser, sign up/login with Expo account
```

### Step 2: Configure EAS

```bash
# Initialize EAS in your project
eas build:configure
```

This creates `eas.json` file.

### Step 3: Build for iOS

```bash
cd c:\Users\USER\.gemini\antigravity\scratch\cordova-migration-client

# Start build
eas build -p ios

# Or with specific options
eas build -p ios --release
```

### Step 4: Monitor Build

In terminal, you'll see:
```
✨ Building for iOS...

📱 Building on EAS servers...
Queued...
Preparing build...
Building...
[████████████████████] 50%

📲 Your app is being built!
Build ID: xyz123
```

### Step 5: Get Your App

After build completes (10-15 mins):

```
✅ Build complete!

📲 Installation link: https://testflight.apple.com/...
```

Options:
- **TestFlight Link** - Share with testers, install on iPhone
- **Direct Download** - Download IPA file to your Mac

### Step 6: Test Your App

1. Open TestFlight link on iPhone
2. Tap "Accept" → "Install"
3. Wait for app to install
4. Open app on iPhone

---

## Option 2: Local Build on macOS 🍎

### Prerequisites

```bash
# 1. Xcode (15GB download)
# - Download from App Store or:
xcode-select --install

# 2. CocoaPods (dependency manager)
sudo gem install cocoapods

# 3. Node & npm (already installed)
node --version  # v18+
npm --version   # v8+
```

### Build Steps

```bash
# 1. Navigate to project
cd c:\Users\USER\.gemini\antigravity\scratch\cordova-migration-client

# 2. Install dependencies
npm install
npx pod-install  # Install iOS pods

# 3. Build for iOS
npm run ios

# Or if that fails:
npx react-native run-ios
```

### Advanced: Using Xcode

```bash
# 1. Open Xcode project
open ios/professionalandroidbase.xcworkspace

# 2. In Xcode:
# - Select target device/simulator (top left)
# - Click Play button (▶)
# - Wait for build to complete
# - App opens on simulator or device
```

### Running on Real iPhone (macOS)

```bash
# 1. Connect iPhone to Mac with USB cable

# 2. In Xcode:
# - Select your iPhone in device selector
# - Click Play (▶)
# - Trust app on iPhone when prompted
# - App launches on your iPhone

# Or via CLI:
npm run ios -- --device "iPhone 15"
```

---

## Option 3: Expo Go (Simplest) 📱

### Step 1: Start Expo

```bash
npx expo start --clear
```

### Step 2: On Your iPhone

1. Download "Expo Go" from App Store
2. Open Expo Go app
3. Tap "Scan QR code"
4. Scan QR from terminal
5. App loads

**Limitation**: Some native features may not work, like:
- `@callstack/liquid-glass` (may not work)
- Some native modules

---

## EAS Build Workflow (Recommended for Windows)

```
┌─────────────────────┐
│  Your Computer      │
│  (Windows/Mac/Linux)│
│  eas build -p ios   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  EAS Cloud Servers  │
│  (Apple's Builders) │
│  - Builds on Mac    │
│  - Signs with cert  │
│  - Creates IPA      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  TestFlight Link    │
│  Share with testers │
│  Or download IPA    │
└─────────────────────┘
```

---

## Common Issues & Fixes

### Issue: "Pod install failed"

```bash
# Solution 1: Clean and retry
cd ios
rm -rf Pods
rm Podfile.lock
pod install
cd ..

# Solution 2: Use correct Ruby version
sudo gem install -n /usr/local/bin cocoapods
```

### Issue: "xcrun: error: unable to find utility"

```bash
# Solution: Install command line tools
xcode-select --install
# or
sudo xcode-select --reset
```

### Issue: "EAS login required"

```bash
# Solution: Create Expo account
eas login
# Opens browser to create account
```

### Issue: "Build stuck or timeout"

```bash
# Cancel build
ctrl+c

# Rebuild with verbose output
eas build -p ios --verbose
```

### Issue: "Codesigning failed"

For local builds on Mac:

```bash
# Solution 1: Use simulator instead of device
npm run ios -- --simulator

# Solution 2: Fix signing in Xcode
# Xcode → Target → Signing & Capabilities
# - Select Team
# - Choose Provisioning Profile
```

---

## EAS Build Configuration

Edit `eas.json` to customize builds:

```json
{
  "build": {
    "preview": {
      "ios": {
        "buildType": "simulator"
      }
    },
    "production": {
      "ios": {
        "buildType": "archive",
        "releaseChannel": "production"
      }
    }
  }
}
```

### Build Commands

```bash
# Preview build (for testing)
eas build -p ios --profile preview

# Production build (for App Store)
eas build -p ios --profile production

# Check build status
eas build:list

# View specific build details
eas build:view <BUILD_ID>
```

---

## Complete iOS Setup on Windows (Using EAS) 🎯

### 5-Minute Setup:

```bash
# 1. Install EAS CLI globally
npm install -g eas-cli

# 2. Login to Expo (opens browser)
eas login

# 3. Configure project
eas build:configure

# 4. Build iOS app
eas build -p ios

# 5. Wait for completion, get TestFlight link
# ✅ Done!
```

### Then on iPhone:

1. Click TestFlight link from email
2. Tap "Accept" in TestFlight app
3. Tap "Install"
4. Open app when ready

---

## Local macOS Setup (Complete)

```bash
# 1. Install Xcode
# Download from App Store (15GB)
# Or: xcode-select --install

# 2. Install dependencies
brew install node  # or use nvm
npm install -g eas-cli

# 3. Install CocoaPods
sudo gem install cocoapods

# 4. In your project
npm install
npx pod-install

# 5. Run on simulator
npm run ios

# 6. Or open in Xcode
open ios/professionalandroidbase.xcworkspace
# Then click Play button (▶)
```

---

## Recommended Approach for You

Since you're on **Windows**:

✅ **Use EAS Cloud Build**

```bash
# 1. Create Expo account
eas login

# 2. Configure
eas build:configure

# 3. Build
eas build -p ios

# 4. Get link, install on iPhone via TestFlight
```

**Why?**
- No Mac needed
- Works on Windows
- App builds on Apple servers
- Can share with testers easily
- `@callstack/liquid-glass` works (native modules included)

---

## After Build Success

### Share with Team

```bash
# EAS automatically uploads to TestFlight
# Share link: https://testflight.apple.com/...

# Everyone with link can install
# No need for Mac or Xcode
```

### Submit to App Store

```bash
# After testing on TestFlight:
eas submit -p ios

# Choose TestFlight build
# Auto-submits to App Store
# ✅ Done in 1 command!
```

---

**Status**: Ready for iOS builds! 🎉  
**Recommended**: Use EAS Cloud Build (Windows-friendly)  
**Command**: `eas build -p ios`

Need help? See `eas.json` configuration or run `eas build --help`
