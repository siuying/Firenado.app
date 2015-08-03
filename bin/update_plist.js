#!/usr/bin/env node

var fs = require('fs')
var plist = require('plist')
var process = require('process')

var appName = "Firenado"
var appVersion = "0.1.1"
var appId = "hk.ignition.Firenado"
var plistFile = 'build/' + appName + '/osx/Firenado.app/Contents/Info.plist'

var obj = plist.parse(fs.readFileSync(plistFile, 'utf8'));
obj["CFBundleName"] = appName
obj["CFBundleDisplayName"] = appName
obj["CFBundleVersion"] = appVersion
obj["CFBundleIdentifier"] = appId
fs.writeFileSync(plistFile, plist.build(obj));
