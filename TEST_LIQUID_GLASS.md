# 🧪 How to Test @callstack/liquid-glass

## Step 1: Install & Build

```bash
# Install dependencies with liquid-glass
npm install

# Clear Expo cache and start fresh
npx expo start --clear
```

## Step 2: View the Test Screen

### Option A: Programmatically (Easy for Testing)

1. Open your app in Expo Go
2. In your terminal, press `j` to open the debugger menu
3. Or manually navigate in code by editing `AppNavigator.js`

### Option B: Add Button in HomeScreen

Edit `src/screens/HomeScreen.js` and add this button:

```javascript
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  
  return (
    <View>
      <TouchableOpacity 
        onPress={() => navigation.navigate('LiquidGlassTest')}
        style={{ padding: 16, backgroundColor: 'blue', margin: 16, borderRadius: 8 }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          🎨 Test Liquid Glass
        </Text>
      </TouchableOpacity>
      {/* Rest of your home screen */}
    </View>
  );
}
```

### Option C: Via React Navigation DevTools

Use React Navigation's built-in linking to navigate directly:

```bash
# In Expo Go, open URL like:
# yourapp://LiquidGlassTest
```

## Step 3: Check If It Works

When you open the test screen, you should see:

✅ **Four glass cards** with different intensities:
- Card 1: Light Glass (intensity: 0.5)
- Card 2: Medium Glass (intensity: 0.7) - **DEFAULT**
- Card 3: Strong Glass (intensity: 0.9)
- Card 4: Glass with nested content

✅ **Visual indicators**:
- Frosted/blur effect on each card
- Semi-transparent background
- Text visible through the glass
- Cards should look like "frosted glass" effect

✅ **No errors**:
- No red error screen
- No console warnings about TurboModuleRegistry
- Smooth scrolling

## What to Look For

### ✅ Working Correctly
```
The cards show a frosted glass effect - like looking through
frosted glass with a subtle blur in the background
```

### ❌ Not Working
```
ERROR: TurboModuleRegistry.getEnforcing(...): 
'NativeLiquidGlassModule' could not be found
```

**This means:** You need to run on a real device or use Expo Go

## Troubleshooting

### Error: "NativeLiquidGlassModule not found"

This means the Expo Go app doesn't have the native module. Solutions:

1. **Use Expo Go (Development)**
   ```bash
   npx expo start
   # Scan QR code with Expo Go app
   ```

2. **Build Custom Expo App**
   ```bash
   eas build -p ios
   eas build -p android
   ```

3. **Use React Native CLI (Local Build)**
   ```bash
   npm run ios     # macOS only
   npm run android # Windows/Mac/Linux
   ```

### Cards Not Showing Glass Effect

- Check if `LiquidGlassCard` component imports are correct
- Verify intensity value is between 0 and 1
- Make sure your theme colors are properly loaded

### App Won't Start

```bash
# Clear everything and restart
npm run android -- --clear
# or
npm run ios -- --clear
```

## Expected Output

**iOS Device:**
- Smooth frosted glass effect
- Clear text visibility through glass
- No performance issues

**Android Device:**
- Similar frosted glass effect
- Good performance
- Consistent with iOS

**Expo Go App:**
- May not work (native module limitation)
- Works better with custom build

## Next Steps After Testing

If glass effects are working:
1. ✅ Keep `@callstack/liquid-glass` in dependencies
2. ✅ Use `LiquidGlassCard` in your screens
3. ✅ Customize intensity/blur as needed
4. ✅ Build native apps with `eas build` for production

---

**Test Screen Location**: `src/screens/LiquidGlassTestScreen.js`  
**Component Location**: `src/components/LiquidGlassCard.js`  
**Route Name**: `LiquidGlassTest`
