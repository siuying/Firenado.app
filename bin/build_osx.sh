#!/bin/bash

# Cleanup
rm -rf build/PiratePlay/osx
mkdir -p build/PiratePlay/osx

# Rebuild
./node_modules/.bin/electron-rebuild
CURRENT_DIR=`pwd`
cd ./node_modules/wcjs-player/node_modules/wcjs-renderer/node_modules/webchimera.js/ && bash build_electron.sh && cd $CURRENT_DIR

# Copy app to destination
cp -R node_modules/electron-prebuilt/dist/Electron.app build/PiratePlay/osx
cp -R app build/PiratePlay/osx/Electron.app/Contents/Resources/

# Copy modules
unzip vendor/libvlc_2.2.1_mac.zip -d node_modules/wcjs-player/node_modules/wcjs-renderer/node_modules/webchimera.js/build/Release/
cp -R node_modules build/PiratePlay/osx/Electron.app/Contents/Resources/app
rm -rf build/PiratePlay/osx/Electron.app/Contents/Resources/app/node_modules/{electron-prebuilt,electron-rebuild}
