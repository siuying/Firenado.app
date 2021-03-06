#!/bin/bash

APP_NAME=Firenado
SIGNING_USER="Developer ID Application: Ignition Soft Limited"

# Cleanup
rm -rf build/$APP_NAME/osx
mkdir -p build/$APP_NAME/osx

# Rebuild
./node_modules/.bin/electron-rebuild
CURRENT_DIR=`pwd`
cd ./node_modules/wcjs-player/node_modules/wcjs-renderer/node_modules/webchimera.js/ && bash build_electron.sh && cd $CURRENT_DIR

# Copy app to destination
cp -R node_modules/electron-prebuilt/dist/Electron.app build/$APP_NAME/osx/${APP_NAME}.app
cp -R app build/$APP_NAME/osx/${APP_NAME}.app/Contents/Resources/

rm -rf build/$APP_NAME/osx/${APP_NAME}.app/Contents/Resources/atom.icns
cp -R Arts/Firenado.icns build/$APP_NAME/osx/${APP_NAME}.app/Contents/Resources/atom.icns
./bin/update_plist.js

# Copy modules
unzip vendor/libvlc_2.2.1_mac.zip -d node_modules/wcjs-player/node_modules/wcjs-renderer/node_modules/webchimera.js/build/Release/
cp -R node_modules build/$APP_NAME/osx/${APP_NAME}.app/Contents/Resources/app
rm -rf build/$APP_NAME/osx/${APP_NAME}.app/Contents/Resources/app/node_modules/{electron-prebuilt,electron-rebuild}

# Code signing
export CODESIGN_ALLOCATE="/Applications/Xcode.app/Contents/Developer/usr/bin/codesign_allocate"
codesign --force --sign "${SIGNING_USER}" -vv --deep build/Firenado/osx/Firenado.app
