require("babel/register");

var app = require('app');
var ipc = require('ipc');

var Server = require('./server/app');

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
  Server.WindowActions.openMainWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  Server.WindowActions.openMainWindow();
});

ipc.on('open-video', function(event, title, url) {
  Server.WindowActions.openVideoWindow({title: title, url: url});
});
