#!/bin/bash

# Cleanup
rm -rf build/PiratePlay/osx
mkdir -p build/PiratePlay/osx

# Rebuild
./node_modules/.bin/electron-rebuild app

# Copy app to destination
cp -r node_modules/electron-prebuilt/dist/Electron.app build/PiratePlay/osx/
cp -r app build/PiratePlay/osx/Electron.app/Contents/Resources/

# Copy libvlc files
cd build/PiratePlay/osx/Electron.app/Contents/Resources/app/node_modules/wcjs-player/node_modules/wcjs-renderer/node_modules/webchimera.js/ && \
  ln -s libvlccore.8.dylib libvlccore.dylib && \
  ln -s libvlc.5.dylib libvlc.dylib
