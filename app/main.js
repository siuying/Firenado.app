require("babel/register")({
  stage: 0
})

var app = require('app')
var ipc = require('ipc')

// use global so that client can access via remote
Server = require('./server/app')

// Report crashes to our server.
require('crash-reporter').start()

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit()
  }
})

app.on('activate-with-no-open-windows', function() {
  Server.WindowActions.openMainWindow()
})

app.on('ready', function() {
  Server.WindowActions.openMainWindow();
})
