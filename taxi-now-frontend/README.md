## Install

#### After every git push

```bash
rm -rf node_modules # if previously ran npm install
npm install
```

## Configuration

#### APIs Required

To configure the frontend to work, you would need these APIs (they are free)
- Google Maps API
    - Android (android/app/src/main/Androidanifest.xml > Line 40)
    - IOS (ios/taxinowfrontend/AppDelegate.mm > Line 11)
- Google Places API (components/SearchBar.tsx > Line 22)

#### Backend Server hosting

Change constants/ServerAddress.ts to the current server ip address.

## Android

```bash
npx expo run:android
```

Note that your system environment must have JAVA_HOME variable pointing to a version 17 JDK.

#### Development

Want to connect to local backend server?
Run

```bash
adb reverse tcp:{EXTERNAL_APP_PORT} tcp:{INTERNAL_APP_PORT}
```

where EXTERNAL_APP_PORT and INTENRAL_APP_PORT is 8080.

## Ios

Pre-setup

```bash
cd ios
pod install
cd ..
```

Run the simulator

```bash
npx expo run:ios
```

Run on local device

```bash
npx expo run:ios --device <device UUID> --configuration Release
```
