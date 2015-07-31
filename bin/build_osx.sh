#!/bin/bash

APP_NAME=Firenado

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

# Copy modules
unzip vendor/libvlc_2.2.1_mac.zip -d node_modules/wcjs-player/node_modules/wcjs-renderer/node_modules/webchimera.js/build/Release/
cp -R node_modules build/$APP_NAME/osx/${APP_NAME}.app/Contents/Resources/app
rm -rf build/$APP_NAME/osx/${APP_NAME}.app/Contents/Resources/app/node_modules/{electron-prebuilt,electron-rebuild}
