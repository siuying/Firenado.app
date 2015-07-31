import alt from '../alt'
import app from 'app'
import ipc from 'ipc'

import BrowserWindow from 'browser-window'
import WindowActions from '../actions/WindowActions'

var mainWindow = null;
var videoWindow = null;

class WindowStore {
  constructor() {
    this.bindActions(WindowActions)
  }

  onOpenMainWindow() {
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
  }

  onOpenVideoWindow(params) {
    var data = JSON.stringify(params);
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

export default alt.createStore(WindowStore, 'WindowStore')
