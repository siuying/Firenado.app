var polyfill = require("babel/register");

var BrowserWindow = require('browser-window');  // Module to create native browser window.
var app = require('app');  // Module to control application life.
var ipc = require('ipc');

var mainWindow = null;
var videoWindow = null;

var WindowStore = {
  openMainWindow: function() {
    if (mainWindow) {
      mainWindow.show();
      return;
    }

    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600});

    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/../../index.html');

    // Open the devtools.
    mainWindow.openDevTools({detach: true});

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
      if (videoWindow) {
        videoWindow.destroy();
      }
      mainWindow = null;
    });
  },

  openVideoWindow: function(title, url) {
    var data = JSON.stringify({url: url, title: title});
    var base64Data = new Buffer(data).toString("base64");

    // if video window exists
    if (videoWindow) {
      videoWindow.loadUrl('file://' + __dirname + '/../../video.html#' + base64Data);
      videoWindow.show();
      return;
    }

    videoWindow = new BrowserWindow({width: 800, height: 600});
    videoWindow.loadUrl('file://' + __dirname + '/../../video.html#' + base64Data);
    videoWindow.on('closed', function() {
      videoWindow = null;
    });
  }
}

export default WindowStore
