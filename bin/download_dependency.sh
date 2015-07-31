#!/bin/bash

# download the libvlc 2.2.1 static build and move vendor
wget "https://dl.dropboxusercontent.com/u/3810814/libvlc_2.2.1_mac.zip" \
  && mv libvlc_2.2.1_mac.zip vendor
