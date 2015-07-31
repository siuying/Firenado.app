var polyfill = require("babel/register");

var app = require('app');
var ipc = require('ipc');

var WindowStore = require('./server/stores/WindowStore');

// Report crashes to our server.
require('crash-reporter').start();

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('activate-with-no-open-windows', function() {
  WindowStore.openMainWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  WindowStore.openMainWindow();
});

ipc.on('open-video', function(event, title, url) {
  WindowStore.openVideoWindow(title, url);
});
