#!/bin/bash

# download the libvlc 2.2.1 static build and move it to build folder
wget "https://dl.dropboxusercontent.com/u/3810814/libvlc_2.2.1_mac.zip" \
  && unzip libvlc_2.2.1_mac.zip \
  && mv lib app/node_modules/wcjs-player/node_modules/wcjs-renderer/node_modules/webchimera.js/build/Release/
