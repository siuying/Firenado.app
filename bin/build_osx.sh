#!/bin/bash

cd ./app &&  ./node_modules/.bin/electron-rebuild && cd ..
mkdir -p build/PiratePlay/osx/
echo rm -rf build/PiratePlay/osx/*.app
cp -r node_modules/electron-prebuilt/dist/Electron.app build/PiratePlay/osx/
cp -r app build/PiratePlay/osx/Electron.app/Contents/Resources/
cd build/PiratePlay/osx/Electron.app/Contents/Resources/app/node_modules/wcjs-player/node_modules/wcjs-renderer/node_modules/webchimera.js/ && \
  ln -s libvlccore.8.dylib libvlccore.dylib && \
  ln -s libvlc.5.dylib libvlc.dylib
